'use client';

import { useState } from 'react';
import type { Expense, ShoppingList, ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';
import { Wallet, TrendingUp, ShoppingCart, Plus, Trash2, CheckCircle2, Link2, DollarSign, ArrowRight } from 'lucide-react';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onUpdateIncome: (income: number) => void;
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onAddShoppingList: (list: ShoppingList) => void;
  onToggleShoppingItem: (listId: string, itemIdx: number) => void;
  onUpdateGoalProgress: (id: string, delta: number) => void;
}

const CATEGORIES = ['Yiyecek', 'Ulaşım', 'Sağlık', 'Eğlence', 'Giyim', 'Fatura', 'Diğer'];

export default function BudgetOverlay({ 
  active, modState, onClose, onUpdateIncome, onAddExpense, onDeleteExpense, onAddShoppingList, onToggleShoppingItem, onUpdateGoalProgress
}: Props) {
  const [incomeInput, setIncomeInput] = useState(String(modState.budget.income || ''));
  const [expForm, setExpForm] = useState({ name: '', amount: '', category: 'Yiyecek', date: formatDate(new Date()) });
  const [listName, setListName] = useState('');
  const [listItems, setListItems] = useState('');
  const [savingsGoalId, setSavingsGoalId] = useState('');
  const [savingsAmount, setSavingsAmount] = useState('');
  
  // Shopping Price State
  const [showPriceModal, setShowPriceModal] = useState<string | null>(null);
  const [totalPrice, setTotalPrice] = useState('');

  const totalExpenses = modState.budget.expenses.reduce((s, e) => s + e.amount, 0);
  const balance = modState.budget.income - totalExpenses;

  const handleSaveIncome = () => {
    const v = parseFloat(incomeInput) || 0;
    onUpdateIncome(v);
  };

  const handleAddExpense = () => {
    if (!expForm.name || !expForm.amount) { alert('Gider adı ve tutar girin'); return; }
    const expense: Expense = {
      id: 'exp_' + Date.now(),
      name: expForm.name,
      amount: parseFloat(expForm.amount) || 0,
      category: expForm.category,
      date: expForm.date,
    };
    onAddExpense(expense);
    setExpForm(p => ({ ...p, name: '', amount: '' }));
  };

  const handleAddList = () => {
    if (!listName) { alert('Liste adı girin'); return; }
    const items = listItems.split('\n').map(s => s.trim()).filter(Boolean).map(text => ({ text, checked: false }));
    const list: ShoppingList = {
      id: 'list_' + Date.now(),
      name: listName,
      date: formatDate(new Date()),
      items,
    };
    onAddShoppingList(list);
    setListName('');
    setListItems('');
  };

  const handleFinishShopping = (listId: string) => {
    const list = modState.budget.shoppingLists.find(l => l.id === listId);
    if (!list) return;
    setShowPriceModal(listId);
  };

  const handleSaveShoppingExpense = () => {
    const amount = parseFloat(totalPrice) || 0;
    const list = modState.budget.shoppingLists.find(l => l.id === showPriceModal);
    if (amount > 0 && list) {
       onAddExpense({
         id: 'exp_shop_' + Date.now(),
         name: `Market: ${list.name}`,
         amount,
         category: 'Yiyecek',
         date: formatDate(new Date())
       });
       setShowPriceModal(null);
       setTotalPrice('');
    }
  };

  const handleApplySavings = () => {
    const amt = parseFloat(savingsAmount) || 0;
    if (amt <= 0 || !savingsGoalId) return;
    onUpdateGoalProgress(savingsGoalId, amt);
    setSavingsAmount('');
    alert(`₺${amt} tasarruf hedefine başarıyla aktarıldı!`);
  };

  const selectedGoal = modState.goals.find(g => g.id === savingsGoalId);

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="budgetOverlay">
      <div className="module-header">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Wallet className="text-emerald-500" /> Bütçe & Tasarruf
        </h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid" style={{ gridTemplateColumns: '1fr 340px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Summary */}
            <div className="module-card budget-accent">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0 }}><TrendingUp size={18} /> Finansal Özet</h3>
                  <div style={{ display: 'flex', gap: 10 }}>
                     <input type="number" value={incomeInput} onChange={e => setIncomeInput(e.target.value)} placeholder="Gelir Gir..." style={{ width: 120, height: 36, borderRadius: 10, border: '1px solid #e2e8f0', padding: '0 10px', fontSize: '0.85rem' }} />
                     <button className="m-btn primary" onClick={handleSaveIncome} style={{ height: 36, borderRadius: 10, fontSize: '0.8rem' }}>Geliri Kaydet</button>
                  </div>
               </div>
               <div className="budget-summary" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                  <div className="b-card" style={{ background: '#ecfdf5', padding: 20, borderRadius: 20, border: '1px solid #d1fae5' }}>
                     <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#059669' }}>AYLIK GELİR</span>
                     <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#065f46' }}>₺{modState.budget.income.toLocaleString()}</div>
                  </div>
                  <div className="b-card" style={{ background: '#fef2f2', padding: 20, borderRadius: 20, border: '1px solid #fee2e2' }}>
                     <span style={{ fontSize: '0.75rem', fontWeight: 900, color: '#dc2626' }}>TOPLAM GİDER</span>
                     <div style={{ fontSize: '1.5rem', fontWeight: 950, color: '#991b1b' }}>₺{totalExpenses.toLocaleString()}</div>
                  </div>
                  <div className="b-card" style={{ background: balance >= 0 ? '#eff6ff' : '#fff7ed', padding: 20, borderRadius: 20, border: balance >= 0 ? '#dbeafe' : '#ffedd5' }}>
                     <span style={{ fontSize: '0.75rem', fontWeight: 900, color: balance >= 0 ? '#2563eb' : '#d97706' }}>KALAN BAKİYE</span>
                     <div style={{ fontSize: '1.5rem', fontWeight: 950, color: balance >= 0 ? '#1e40af' : '#92400e' }}>₺{balance.toLocaleString()}</div>
                  </div>
               </div>
            </div>

            {/* Savings Goal Link */}
            <div className="module-card" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)', border: '1px solid #86efac', padding: 24, borderRadius: 24 }}>
               <h3 style={{ color: '#166534', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: 10 }}>
                 <CheckCircle2 size={20} /> Hedef Odaklı Tasarruf
               </h3>
               <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <div style={{ flex: 1 }}>
                     <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#166534', display: 'block', marginBottom: 6 }}>HEDEF SEÇ</label>
                     <select value={savingsGoalId} onChange={e => setSavingsGoalId(e.target.value)} style={{ width: '100%', height: 44, borderRadius: 12, border: '1px solid #86efac', padding: '0 12px' }}>
                        <option value="">Hedef seçin...</option>
                        {modState.goals.map(g => <option key={g.id} value={g.id}>{g.icon} {g.name}</option>)}
                     </select>
                  </div>
                  <div style={{ width: 140 }}>
                     <label style={{ fontSize: '0.75rem', fontWeight: 900, color: '#166534', display: 'block', marginBottom: 6 }}>MİKTAR (₺)</label>
                     <input type="number" value={savingsAmount} onChange={e => setSavingsAmount(e.target.value)} placeholder="0" style={{ width: '100%', height: 44, borderRadius: 12, border: '1px solid #86efac', padding: '0 12px' }} />
                  </div>
                  <button className="m-btn success" onClick={handleApplySavings} style={{ background: '#166534', color: 'white', height: 44, padding: '0 20px', borderRadius: 12, fontWeight: 900 }}>AKTARIYORUM <ArrowRight size={16} /></button>
               </div>
               {selectedGoal && (
                 <p style={{ margin: '12px 0 0 0', fontSize: '0.8rem', color: '#166534', fontWeight: 700 }}>
                   💡 Bu tutarı aktardığında <strong>{selectedGoal.name}</strong> hedefine %{((parseFloat(savingsAmount || '0') / selectedGoal.target) * 100).toFixed(1)} yaklaşacaksın.
                 </p>
               )}
            </div>

            {/* Shopping List Section */}
            <div className="module-card">
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ margin: 0 }}><ShoppingCart size={18} /> Alışveriş Listelerim</h3>
                  <button className="m-btn primary" onClick={() => { setListName('Market Alışverişi'); setListItems(''); }} style={{ borderRadius: 10 }}>Yeni Liste</button>
               </div>
               <div className="module-grid">
                  <div style={{ background: '#f8fafc', padding: 20, borderRadius: 20 }}>
                    <div className="m-form-group"><label>Liste İsmi</label><input type="text" value={listName} onChange={e => setListName(e.target.value)} /></div>
                    <div className="m-form-group"><label>Ürünler (Her satıra bir ürün)</label><textarea rows={5} value={listItems} onChange={e => setListItems(e.target.value)} style={{ width: '100%', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0', fontSize: '0.85rem' }} /></div>
                    <button className="m-btn primary" onClick={handleAddList} style={{ width: '100%', borderRadius: 12 }}>LİSTEYİ KAYDET</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {modState.budget.shoppingLists.map(list => (
                      <div key={list.id} style={{ background: '#fff', border: '1px solid #f1f5f9', padding: 16, borderRadius: 20, boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                           <span style={{ fontWeight: 900, color: '#1e293b' }}>{list.name}</span>
                           <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{list.date}</span>
                        </div>
                        {list.items.map((item, idx) => (
                           <div key={idx} onClick={() => onToggleShoppingItem(list.id, idx)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', cursor: 'pointer', opacity: item.checked ? 0.5 : 1 }}>
                              <div style={{ width: 18, height: 18, borderRadius: 4, border: '1px solid #cbd5e1', background: item.checked ? '#10b981' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.6rem' }}>{item.checked ? '✓' : ''}</div>
                              <span style={{ fontSize: '0.85rem', textDecoration: item.checked ? 'line-through' : 'none' }}>{item.text}</span>
                           </div>
                        ))}
                        {list.items.every(i => i.checked) && list.items.length > 0 && (
                          <button onClick={() => handleFinishShopping(list.id)} style={{ width: '100%', marginTop: 12, background: '#ecfdf5', color: '#059669', border: 'none', padding: '8px', borderRadius: 8, fontWeight: 800, fontSize: '0.8rem' }}>
                            ALIŞVERİŞ BİTTİ (GİDER EKLE)
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Add Expense Sidebar */}
            <div className="module-card med-accent">
               <h3 style={{ margin: '0 0 16px 0' }}>💸 Gider Ekle</h3>
               <div className="m-form-group"><label>Açıklama</label><input type="text" placeholder="ör: Kahve" value={expForm.name} onChange={e => setExpForm(p => ({ ...p, name: e.target.value }))} /></div>
               <div className="m-form-group"><label>Tutar (₺)</label><input type="number" placeholder="0" value={expForm.amount} onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))} /></div>
               <div className="m-form-group">
                 <label>Kategori</label>
                 <select value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))}>
                   {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>
               <button className="m-btn success" onClick={handleAddExpense} style={{ width: '100%', height: 44, borderRadius: 12 }}>KAYDET</button>
            </div>

            {/* Last Expenses */}
            <div className="module-card" style={{ flex: 1, overflowY: 'auto' }}>
               <h3>📅 Son Harcamalar</h3>
               {modState.budget.expenses.length === 0 ? (
                 <p style={{ color: '#94a3b8', fontSize: '0.85rem', textAlign: 'center', marginTop: 40 }}>Henüz harcama yok.</p>
               ) : (
                 [...modState.budget.expenses].reverse().map(e => (
                   <div key={e.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                     <div>
                        <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>{e.name}</div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{e.category} • {e.date}</div>
                     </div>
                     <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 950, color: '#ef4444' }}>₺{e.amount}</span>
                        <button onClick={() => onDeleteExpense(e.id)} style={{ color: '#fecaca', background: 'none', border: 'none' }}><Trash2 size={14} /></button>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        </div>
      </div>

      {/* Price Modal */}
      {showPriceModal && (
        <div className="modal-overlay active">
          <div className="modal" style={{ maxWidth: 360, padding: 30, borderRadius: 24 }}>
             <h2 style={{ textAlign: 'center' }}>Harika! 🎉</h2>
             <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem', marginBottom: 20 }}>Tüm ürünleri aldın. Toplam ne kadar harcadın?</p>
             <div className="m-form-group">
                <label>TOPLAM TUTAR (₺)</label>
                <input type="number" value={totalPrice} onChange={e => setTotalPrice(e.target.value)} autoFocus style={{ fontSize: '1.5rem', textAlign: 'center', height: 60 }} />
             </div>
             <div className="confirm-btns">
                <button className="m-btn success" onClick={handleSaveShoppingExpense} style={{ width: '100%', height: 48, borderRadius: 14 }}>GİDER OLARAK KAYDET</button>
                <button className="m-btn secondary" onClick={() => setShowPriceModal(null)} style={{ width: '100%', height: 48, borderRadius: 14 }}>İPTAL</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
