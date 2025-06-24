import { useState } from 'react';
   import InvoiceForm from './InvoiceForm';
   import InvoiceHistory from './InvoiceHistory';
   import './styles.css';

   function App() {
     const [view, setView] = useState('form');

     return (
       <div className="app-container">
         <div className="nav-buttons">
           <button
             onClick={() => setView('form')}
             className={view === 'form' ? 'active' : ''}
           >
             Nouvelle Facture
           </button>
           <button
             onClick={() => setView('history')}
             className={view === 'history' ? 'active' : ''}
           >
             Historique
           </button>
         </div>
         {view === 'form' ? <InvoiceForm /> : <InvoiceHistory />}
       </div>
     );
   }

   export default App;