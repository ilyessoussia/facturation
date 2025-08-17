import { useState } from 'react';
import writtenNumber from 'written-number';
import logoAcrecert from './assets/logoAcrecert.png';

// Utility function to generate a unique ID
const generateId = () => {
  return 'id_' + Math.random().toString(36).substr(2, 9) + Date.now();
};

function InvoiceForm() {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    invoiceNumber: '0022025',
    date: today,
    clientName: '',
    clientAddress: '',
    clientEmail: '',
    clientMF: '',
    items: [{ description: '', unitPrice: 0, manDays: 1, total: 0 }],
    timbre: 1.000,
    taxRate: 19,
    documentType: 'facture',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.invoiceNumber) newErrors.invoiceNumber = 'Numéro de facture requis';
    if (!formData.clientName) newErrors.clientName = 'Nom du client requis';
    if (!formData.items.some(item => item.description)) newErrors.items = 'Au moins un article avec description est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    if (field === 'unitPrice' || field === 'manDays') {
      newItems[index].total = (newItems[index].unitPrice * newItems[index].manDays).toFixed(2);
    }
    setFormData({ ...formData, items: newItems });
    setErrors({ ...errors, items: '' });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', unitPrice: 0, manDays: 1, total: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const calculateTotalHT = () => {
    return formData.items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
  };

  const calculateTVA = () => {
    return (calculateTotalHT() * (parseFloat(formData.taxRate || 19) / 100)).toFixed(2);
  };

  const calculateTotalTTC = () => {
    return (parseFloat(calculateTotalHT()) + parseFloat(calculateTVA()) + parseFloat(formData.timbre || 0)).toFixed(2);
  };

  const saveToLocalStorage = async () => {
    if (!validateForm()) return;
    if (!window.confirm(`Confirmer l'enregistrement de ce ${formData.documentType} ?`)) return;
    setIsLoading(true);

    try {
      // Get existing invoices from localStorage or initialize an empty array
      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      
      // Create new invoice object
      const newInvoice = {
        id: generateId(),
        invoice_number: formData.invoiceNumber,
        date: formData.date,
        client_name: formData.clientName,
        client_address: formData.clientAddress,
        client_email: formData.clientEmail,
        client_mf: formData.clientMF,
        items: formData.items,
        timbre: parseFloat(formData.timbre),
        tax_rate: parseFloat(formData.taxRate || 19),
        total_ht: parseFloat(calculateTotalHT()),
        tva: parseFloat(calculateTVA()),
        total_ttc: parseFloat(calculateTotalTTC()),
        document_type: formData.documentType,
        created_at: new Date().toISOString(),
      };

      // Add new invoice to the array and save to localStorage
      invoices.push(newInvoice);
      localStorage.setItem('invoices', JSON.stringify(invoices));

      alert(`${formData.documentType.charAt(0).toUpperCase() + formData.documentType.slice(1)} enregistré avec succès !`);
      setFormData({
        invoiceNumber: '',
        date: today,
        clientName: '',
        clientAddress: '',
        clientEmail: '',
        clientMF: '',
        items: [{ description: '', unitPrice: 0, manDays: 1, total: 0 }],
        timbre: 1.000,
        taxRate: 19,
        documentType: 'facture',
      });
    } catch (error) {
      alert('Erreur lors de l\'enregistrement : ' + error.message);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatAmountInWords = (amount) => {
    writtenNumber.defaults.lang = 'fr';
    const integerPart = Math.floor(amount);
    const millimes = Math.round((amount % 1) * 1000);
    let result = `${writtenNumber(integerPart)} dinar${integerPart !== 1 ? 's' : ''}`;
    if (millimes > 0) {
      result += ` et ${writtenNumber(millimes)} millime${millimes !== 1 ? 's' : ''}`;
    }
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  return (
    <div>
      <div className="no-print button-container">
        <select
          name="documentType"
          value={formData.documentType}
          onChange={handleInputChange}
          className="document-type-select tooltip"
          data-tooltip="Choisir le type de document"
        >
          <option value="facture">Facture</option>
          <option value="devis">Devis</option>
        </select>
        <button
          onClick={saveToLocalStorage}
          disabled={isLoading}
          className="tooltip"
          data-tooltip="Enregistrer dans l'historique"
        >
          Enregistrer
          {isLoading && <span className="loading-spinner"></span>}
        </button>
      </div>
      <div className="invoice-container">
        <div className="header">
          <img src={logoAcrecert} alt="Acrecert Logo" className="logo-placeholder" />
          <div className="yellow-square-top"></div>
          <div className="company-details">
            <p>Bureau de Consulting en Informatique</p>
            <p>MF : 1912549Q/A/M/000</p>
          </div>
        </div>

        <div className="facture-title">{formData.documentType.toUpperCase()}</div>

        <div className="invoice-details">
          <div className="left">
            <p>
              <strong>{formData.documentType.toUpperCase()} N° :</strong>
              <input
                type="text"
                name="invoiceNumber"
                value={formData.invoiceNumber}
                onChange={handleInputChange}
              />
              {errors.invoiceNumber && <span className="error-message">{errors.invoiceNumber}</span>}
            </p>
            <p><strong>DATE :</strong> <input type="date" name="date" value={formData.date} onChange={handleInputChange} /></p>
          </div>
          <div className="right">
            <p>
              <strong>Client :</strong>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleInputChange}
              />
              {errors.clientName && <span className="error-message">{errors.clientName}</span>}
            </p>
            <p>
              <strong>Adresse :</strong>
              <textarea
                name="clientAddress"
                value={formData.clientAddress}
                onChange={handleInputChange}
              ></textarea>
            </p>
            <p><strong>Mail :</strong> <input type="email" name="clientEmail" value={formData.clientEmail} onChange={handleInputChange} /></p>
            <p><strong>MF :</strong> <input type="text" name="clientMF" value={formData.clientMF} onChange={handleInputChange} /></p>
          </div>
        </div>

        <table className="items-table">
          <thead>
            <tr>
              <th>Description :</th>
              <th>Prix Unitaire :</th>
              <th>Homme-jour :</th>
              <th>Total :</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index}>
                <td><input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} /></td>
                <td><input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} min="0" step="0.01" /></td>
                <td><input type="number" value={item.manDays} onChange={(e) => handleItemChange(index, 'manDays', e.target.value)} min="1" /></td>
                <td>{item.total}</td>
                {formData.items.length > 1 && (
                  <td className="no-print">
                    <button
                      className="remove-button tooltip"
                      onClick={() => removeItem(index)}
                      data-tooltip="Supprimer cet article"
                    >
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
            {[...Array(5 - formData.items.length)].map((_, index) => (
              <tr key={`empty-${index}`}>
                <td> </td>
                <td> </td>
                <td> </td>
                <td> </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          className="no-print add-item tooltip"
          onClick={addItem}
          data-tooltip="Ajouter un nouvel article"
        >
          Ajouter un article
        </button>
        {errors.items && <div className="error-message" style={{ marginLeft: '40px' }}>{errors.items}</div>}

        <div className="totals-bank-section">
          <div className="totals">
            <p><strong>TOTAL HT :</strong> {calculateTotalHT()} TND</p>
            <p>
              <strong>TVA :</strong>
              <input
                type="number"
                name="taxRate"
                value={formData.taxRate}
                onChange={handleInputChange}
                min="0"
                step="0.1"
                style={{ width: '60px', marginRight: '5px' }}
              />
              % : {calculateTVA()} TND
            </p>
            <p><strong>TIMBRE :</strong> <input type="number" name="timbre" value={formData.timbre} readOnly className="timbre-input" /> TND</p>
            <p><strong>TOTAL TTC :</strong> {calculateTotalTTC()} TND</p>
            <p className="amount-in-words">
              Arrêtée la présente à la somme de : {formatAmountInWords(calculateTotalTTC())} TND
            </p>
          </div>
        </div>

        {formData.documentType === 'facture' && (
          <div className="payment-info">
            <h2>RÈGLEMENT :</h2>
            <p>Par virement bancaire :</p>
            <p>Banque : UIB-Teboulba</p>
            <p>Compte : 12 905 00 00033037045 84</p>
          </div>
        )}

        <div className="footer">
          <p><strong>Site web :</strong> www.acrecert.com <span>|</span> <strong>Mail :</strong> contact@acrecert.com <span>|</span> <strong>Adresse :</strong> Cheraf, Bekalta, Monastir</p>
          <p><strong>Tel :</strong> 99 10 99 72 / 99 10 99 87</p>
          <div className="decorative-square"></div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceForm;