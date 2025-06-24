import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabaseClient';
import writtenNumber from 'written-number';
import jsPDF from 'jspdf';
import logoAcrecert from './assets/logoAcrecert.png';

function InvoiceHistory() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const componentRef = useRef();

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching invoices:', error);
    } else {
      setInvoices(data);
    }
    setIsLoading(false);
  };

  const viewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setEditInvoice(null);
  };

  const editInvoiceDetails = (invoice) => {
    setEditInvoice({
      id: invoice.id,
      invoiceNumber: invoice.invoice_number,
      date: invoice.date.split('T')[0],
      dueDate: invoice.due_date ? invoice.due_date.split('T')[0] : '',
      clientName: invoice.client_name,
      clientAddress: invoice.client_address,
      clientEmail: invoice.client_email,
      clientMF: invoice.client_mf,
      items: invoice.items.map(item => ({
        description: item.description,
        unitPrice: item.unitPrice,
        manDays: item.quantity,
        total: item.total
      })),
      timbre: invoice.timbre,
      taxRate: invoice.tax_rate || 19,
      documentType: invoice.document_type,
    });
    setSelectedInvoice(null);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!editInvoice.invoiceNumber) newErrors.invoiceNumber = 'Numéro de facture requis';
    if (!editInvoice.clientName) newErrors.clientName = 'Nom du client requis';
    if (!editInvoice.items.some(item => item.description)) newErrors.items = 'Au moins un article avec description est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditInvoice({ ...editInvoice, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...editInvoice.items];
    newItems[index][field] = value;
    if (field === 'unitPrice' || field === 'manDays') {
      newItems[index].total = (newItems[index].unitPrice * newItems[index].manDays).toFixed(2);
    }
    setEditInvoice({ ...editInvoice, items: newItems });
    setErrors({ ...errors, items: '' });
  };

  const addItem = () => {
    setEditInvoice({
      ...editInvoice,
      items: [...editInvoice.items, { description: '', unitPrice: 0, manDays: 1, total: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = editInvoice.items.filter((_, i) => i !== index);
    setEditInvoice({ ...editInvoice, items: newItems });
  };

  const calculateTotalHT = () => {
    return editInvoice.items.reduce((sum, item) => sum + parseFloat(item.total || 0), 0).toFixed(2);
  };

  const calculateTVA = () => {
    return (calculateTotalHT() * (parseFloat(editInvoice.taxRate || 19) / 100)).toFixed(2);
  };

  const calculateTotalTTC = () => {
    return (parseFloat(calculateTotalHT()) + parseFloat(calculateTVA()) + parseFloat(editInvoice.timbre || 0)).toFixed(2);
  };

  const saveEdits = async () => {
    if (!validateForm()) return;
    if (!window.confirm(`Confirmer la modification de ce ${editInvoice.documentType} ?`)) return;
    setIsLoading(true);
    const { error } = await supabase.from('invoices').update({
      invoice_number: editInvoice.invoiceNumber,
      date: editInvoice.date,
      due_date: editInvoice.documentType === 'facture' ? editInvoice.dueDate : null,
      client_name: editInvoice.clientName,
      client_address: editInvoice.clientAddress,
      client_email: editInvoice.clientEmail,
      client_mf: editInvoice.clientMF,
      items: editInvoice.items,
      timbre: parseFloat(editInvoice.timbre),
      tax_rate: parseFloat(editInvoice.taxRate || 19),
      total_ht: parseFloat(calculateTotalHT()),
      tva: parseFloat(calculateTVA()),
      total_ttc: parseFloat(calculateTotalTTC()),
      document_type: editInvoice.documentType,
    }).eq('id', editInvoice.id);
    setIsLoading(false);
    if (error) {
      alert('Erreur lors de la modification : ' + error.message);
    } else {
      alert(`${editInvoice.documentType.charAt(0).toUpperCase() + editInvoice.documentType.slice(1)} modifié avec succès !`);
      setEditInvoice(null);
      fetchInvoices();
    }
  };

  const saveAsPDF = () => {
    if (!selectedInvoice) {
      alert('Veuillez sélectionner un document à enregistrer en PDF.');
      return;
    }
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    doc.html(componentRef.current, {
      callback: function (doc) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        doc.save(`${selectedInvoice.document_type}_${selectedInvoice.invoice_number}_${timestamp}.pdf`);
      },
      x: 0,
      y: 0,
      width: 210,
      windowWidth: 794,
      html2canvas: {
        scale: 0.264583333,
      },
    });
  };

  const sortTable = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sorted = [...invoices].sort((a, b) => {
      if (key === 'date') {
        const dateA = new Date(a[key]);
        const dateB = new Date(b[key]);
        return direction === 'asc' ? dateA - dateB : dateB - dateA;
      }
      const aValue = a[key] ? a[key].toString().toLowerCase() : '';
      const bValue = b[key] ? b[key].toString().toLowerCase() : '';
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setInvoices(sorted);
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.invoice_number.toLowerCase().includes(filter.toLowerCase()) ||
      invoice.client_name.toLowerCase().includes(filter.toLowerCase())
  );

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
      <h2 className="text-2xl font-bold mb-4">Historique des Documents</h2>
      <div className="filter-container">
        <input
          type="text"
          placeholder="Rechercher par numéro ou client..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="tooltip"
          data-tooltip="Filtrer les documents"
        />
        {isLoading && <span className="loading-spinner"></span>}
      </div>
      <table className="history-table">
        <thead>
          <tr>
            <th onClick={() => sortTable('document_type')}>Type</th>
            <th onClick={() => sortTable('invoice_number')}>Numéro</th>
            <th onClick={() => sortTable('client_name')}>Client</th>
            <th onClick={() => sortTable('date')}>Date</th>
            <th onClick={() => sortTable('total_ttc')}>Total TTC</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredInvoices.map((invoice) => (
            <tr key={invoice.id}>
              <td>{invoice.document_type.charAt(0).toUpperCase() + invoice.document_type.slice(1)}</td>
              <td>{invoice.invoice_number}</td>
              <td>{invoice.client_name}</td>
              <td>{formatDate(invoice.date)}</td>
              <td>{invoice.total_ttc} TND</td>
              <td>
                <button
                  onClick={() => viewInvoice(invoice)}
                  className="text-blue-500 tooltip mr-2"
                  data-tooltip="Voir le document"
                >
                  Voir
                </button>
                <button
                  onClick={() => editInvoiceDetails(invoice)}
                  className="text-green-500 tooltip"
                  data-tooltip="Modifier le document"
                >
                  Modifier
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editInvoice && (
        <div>
          <div className="no-print button-container">
            <button
              onClick={saveEdits}
              disabled={isLoading}
              className="tooltip"
              data-tooltip="Enregistrer les modifications"
            >
              Enregistrer
              {isLoading && <span className="loading-spinner"></span>}
            </button>
            <button
              onClick={() => setEditInvoice(null)}
              className="tooltip"
              data-tooltip="Annuler"
            >
              Annuler
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

            <div className="facture-title">{editInvoice.documentType.toUpperCase()}</div>

            <div className="invoice-details">
              <div className="left">
                <p>
                  <strong>{editInvoice.documentType.toUpperCase()} N° :</strong>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={editInvoice.invoiceNumber}
                    onChange={handleInputChange}
                  />
                  {errors.invoiceNumber && <span className="error-message">{errors.invoiceNumber}</span>}
                </p>
                <p><strong>DATE :</strong> <input type="date" name="date" value={editInvoice.date} onChange={handleInputChange} /></p>
                {editInvoice.documentType === 'facture' && (
                  <p><strong>ÉCHÉANCE :</strong> <input type="date" name="dueDate" value={editInvoice.dueDate} onChange={handleInputChange} /></p>
                )}
              </div>
              <div className="right">
                <p>
                  <strong>Client :</strong>
                  <input
                    type="text"
                    name="clientName"
                    value={editInvoice.clientName}
                    onChange={handleInputChange}
                  />
                  {errors.clientName && <span className="error-message">{errors.clientName}</span>}
                </p>
                <p>
                  <strong>Adresse :</strong>
                  <textarea
                    name="clientAddress"
                    value={editInvoice.clientAddress}
                    onChange={handleInputChange}
                  ></textarea>
                </p>
                <p><strong>Mail :</strong> <input type="email" name="clientEmail" value={editInvoice.clientEmail} onChange={handleInputChange} /></p>
                <p><strong>MF :</strong> <input type="text" name="clientMF" value={editInvoice.clientMF} onChange={handleInputChange} /></p>
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
                {editInvoice.items.map((item, index) => (
                  <tr key={index}>
                    <td><input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} /></td>
                    <td><input type="number" value={item.unitPrice} onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)} min="0" step="0.01" /></td>
                    <td><input type="number" value={item.manDays} onChange={(e) => handleItemChange(index, 'manDays', e.target.value)} min="1" /></td>
                    <td>{item.total}</td>
                    {editInvoice.items.length > 1 && (
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
                {[...Array(5 - editInvoice.items.length)].map((_, index) => (
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
                    value={editInvoice.taxRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    style={{ width: '60px', marginRight: '5px' }}
                  />
                  % : {calculateTVA()} TND
                </p>
                <p><strong>TIMBRE :</strong> <input type="number" name="timbre" value={editInvoice.timbre} readOnly className="timbre-input" /> TND</p>
                <p><strong>TOTAL TTC :</strong> {calculateTotalTTC()} TND</p>
                <p className="amount-in-words">
                  Arrêtée la présente à la somme de : {formatAmountInWords(calculateTotalTTC())} TND
                </p>
              </div>
            </div>

            {editInvoice.documentType === 'facture' && (
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
      )}

      {selectedInvoice && !editInvoice && (
        <div>
          <div className="no-print button-container">
            <button
              onClick={saveAsPDF}
              className="tooltip"
              data-tooltip="Enregistrer en PDF"
            >
              Enregistrer en PDF
            </button>
          </div>
          <div ref={componentRef} className="invoice-container">
            <div className="header">
              <img src={logoAcrecert} alt="Acrecert Logo" className="logo-placeholder" />
              <div className="yellow-square-top"></div>
              <div className="company-details">
                <p>Bureau de Consulting en Informatique</p>
                <p>MF : 1912549Q/A/M/000</p>
              </div>
            </div>

            <div className="facture-title">{selectedInvoice.document_type.toUpperCase()}</div>

            <div className="invoice-details">
              <div className="left">
                <p><strong>{selectedInvoice.document_type.toUpperCase()} N° :</strong> {selectedInvoice.invoice_number}</p>
                <p><strong>DATE :</strong> {formatDate(selectedInvoice.date)}</p>
                {selectedInvoice.document_type === 'facture' && selectedInvoice.due_date && (
                  <p><strong>ÉCHÉANCE :</strong> {formatDate(selectedInvoice.due_date)}</p>
                )}
              </div>
              <div className="right">
                <p><strong>Client :</strong> {selectedInvoice.client_name}</p>
                <p><strong>Adresse :</strong> {selectedInvoice.client_address}</p>
                <p><strong>Mail :</strong> {selectedInvoice.client_email}</p>
                <p><strong>MF :</strong> {selectedInvoice.client_mf}</p>
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
                {selectedInvoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.description}</td>
                    <td>{item.unitPrice}</td>
                    <td>{item.manDays || item.quantity}</td>
                    <td>{item.total}</td>
                  </tr>
                ))}
                {[...Array(5 - selectedInvoice.items.length)].map((_, index) => (
                  <tr key={`empty-${index}`}>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                    <td> </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="totals-bank-section">
              <div className="totals">
                <p><strong>TOTAL HT :</strong> {selectedInvoice.total_ht} TND</p>
                <p><strong>TVA {selectedInvoice.tax_rate || 19}% :</strong> {selectedInvoice.tva} TND</p>
                <p><strong>TIMBRE :</strong> {selectedInvoice.timbre} TND</p>
                <p><strong>TOTAL TTC :</strong> {selectedInvoice.total_ttc} TND</p>
                <p className="amount-in-words">
                  Arrêtée la présente à la somme de : {formatAmountInWords(selectedInvoice.total_ttc)} TND
                </p>
              </div>
            </div>

            {selectedInvoice.document_type === 'facture' && (
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
      )}
    </div>
  );
}

export default InvoiceHistory;