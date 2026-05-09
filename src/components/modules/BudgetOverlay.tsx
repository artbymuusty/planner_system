'use client';

import { useState } from 'react';
import type { Expense, ShoppingList, ModuleState } from '@/types';
import { formatDate } from '@/lib/dateUtils';

interface Props {
  active: boolean;
  modState: ModuleState;
  onClose: () => void;
  onUpdateIncome: (income: number) => void;
  onAddExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
  onAddShoppingList: (list: ShoppingList) => void;
  onToggleShoppingItem: (listId: string, itemIdx: number) => void;
}

const CATEGORIES = ['Yiyecek', 'Ulaşım', 'Sağlık', 'Eğlence', 'Giyim', 'Fatura', 'Diğer'];

export default function BudgetOverlay({ active, modState, onClose, onUpdateIncome, onAddExpense, onDeleteExpense, onAddShoppingList, onToggleShoppingItem }: Props) {
  const [incomeInput, setIncomeInput] = useState(String(modState.budget.income || ''));
  const [expForm, setExpForm] = useState({ name: '', amount: '', category: 'Yiyecek', date: formatDate(new Date()) });
  const [listName, setListName] = useState('');
  const [listItems, setListItems] = useState('');

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

  const byCategory = CATEGORIES.map(cat => ({
    cat,
    total: modState.budget.expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0),
  })).filter(x => x.total > 0);

  return (
    <div className={`module-overlay${active ? ' active' : ''}`} id="budgetOverlay">
      <div className="module-header">
        <h2>💰 Bütçe Takibi</h2>
        <button className="close-module" onClick={onClose}>✕</button>
      </div>
      <div className="module-body">
        <div className="module-grid">
          <div className="module-card budget-accent">
            <h3>Genel Bakış</h3>
            <div className="budget-summary">
              <div className="budget-stat income">
                <div className="bs-label">Gelir</div>
                <div className="bs-value">₺{modState.budget.income.toLocaleString()}</div>
              </div>
              <div className="budget-stat expense">
                <div className="bs-label">Gider</div>
                <div className="bs-value">₺{totalExpenses.toLocaleString()}</div>
              </div>
              <div className={`budget-stat balance ${balance >= 0 ? 'positive' : 'negative'}`}>
                <div className="bs-label">Bakiye</div>
                <div className="bs-value">₺{balance.toLocaleString()}</div>
              </div>
            </div>
            <div className="m-form-group" style={{ marginTop: 16 }}>
              <label>Aylık Gelir (₺)</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input type="number" value={incomeInput} onChange={e => setIncomeInput(e.target.value)} style={{ flex: 1 }} />
                <button className="m-btn primary" onClick={handleSaveIncome}>Kaydet</button>
              </div>
            </div>
            {byCategory.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 8, color: '#475569' }}>Kategori Dağılımı</div>
                {byCategory.map(({ cat, total }) => (
                  <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '0.82rem', borderBottom: '1px solid #f1f5f9' }}>
                    <span>{cat}</span>
                    <span style={{ fontWeight: 600 }}>₺{total.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="module-card budget-accent">
            <h3>Gider Ekle</h3>
            <div className="m-form-group"><label>Açıklama</label><input type="text" placeholder="ör: Market alışverişi" value={expForm.name} onChange={e => setExpForm(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="m-form-group"><label>Tutar (₺)</label><input type="number" placeholder="ör: 150" value={expForm.amount} onChange={e => setExpForm(p => ({ ...p, amount: e.target.value }))} /></div>
            <div className="m-form-group">
              <label>Kategori</label>
              <select value={expForm.category} onChange={e => setExpForm(p => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="m-form-group"><label>Tarih</label><input type="date" value={expForm.date} onChange={e => setExpForm(p => ({ ...p, date: e.target.value }))} /></div>
            <button className="m-btn success" onClick={handleAddExpense} style={{ width: '100%' }}>💸 Gider Ekle</button>
          </div>
        </div>

        <div className="module-card budget-accent" style={{ marginTop: 20 }}>
          <h3>Son Giderler</h3>
          <div className="expense-list">
            {modState.budget.expenses.length === 0 ? (
              <p style={{ color: '#64748b', textAlign: 'center', padding: 16 }}>Henüz gider eklenmedi</p>
            ) : (
              [...modState.budget.expenses].reverse().map(e => (
                <div key={e.id} className="expense-item">
                  <div className="exp-cat-badge">{e.category}</div>
                  <div className="exp-info">
                    <div className="exp-name">{e.name}</div>
                    <div className="exp-date">{e.date}</div>
                  </div>
                  <div className="exp-amount">₺{e.amount.toLocaleString()}</div>
                  <button className="exp-delete" onClick={() => onDeleteExpense(e.id)}>✕</button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="module-card" style={{ marginTop: 20 }}>
          <h3>🛒 Alışveriş Listeleri</h3>
          <div className="module-grid">
            <div>
              <div className="m-form-group"><label>Liste Adı</label><input type="text" placeholder="ör: Haftalık Market" value={listName} onChange={e => setListName(e.target.value)} /></div>
              <div className="m-form-group">
                <label>Ürünler (her satıra bir ürün)</label>
                <textarea
                  rows={4}
                  placeholder="Ekmek&#10;Süt&#10;Yumurta"
                  value={listItems}
                  onChange={e => setListItems(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(0,0,0,0.08)', background: '#f8fafc', fontFamily: 'Inter', fontSize: '0.85rem', resize: 'vertical' }}
                />
              </div>
              <button className="m-btn primary" onClick={handleAddList} style={{ width: '100%' }}>+ Liste Oluştur</button>
            </div>
            <div>
              {modState.budget.shoppingLists.length === 0 ? (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Henüz liste oluşturulmadı</p>
              ) : (
                modState.budget.shoppingLists.map(list => (
                  <div key={list.id} className="shopping-list-card">
                    <div className="sl-header">{list.name} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{list.date}</span></div>
                    {list.items.map((item, idx) => (
                      <div key={idx} className={`sl-item${item.checked ? ' checked' : ''}`} onClick={() => onToggleShoppingItem(list.id, idx)}>
                        <span className="sl-check">{item.checked ? '✓' : ''}</span>
                        <span>{item.text}</span>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
