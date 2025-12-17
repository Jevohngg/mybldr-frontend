import React from 'react'
import BaseModal from '../BaseModal/BaseModal'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import styles from './AddPlansModal.module.css'
import { useData } from '../../../app/providers'

export default function AddPlansModal({
  open,
  onClose,
  onDone,
}: {
  open: boolean
  onClose: () => void
  onDone: (selected: string[]) => void
}) {
  const { plans } = useData()
  const [q, setQ] = React.useState('')
  const [selected, setSelected] = React.useState<string[]>([])

  React.useEffect(() => {
    if (!open) return
    setQ('')
    setSelected([])
  }, [open])

  const filtered = plans.filter(p => p.name.toLowerCase().includes(q.toLowerCase()))

  return (
    <BaseModal
      open={open}
      title="Add plans to community"
      onClose={onClose}
      width={860}
      footer={
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onDone(selected)} disabled={selected.length === 0}>
            Done
          </Button>
        </>
      }
    >
      <div className={styles.topRow}>
        <div className={styles.search}>
          <span className={styles.mag} aria-hidden="true">🔍</span>
          <Input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Button>Filter</Button>
      </div>

      <div className={styles.table}>
        <div className={styles.header}>
          <div>Name</div><div>Beds</div><div>Baths</div><div>ARU</div>
        </div>

        {filtered.map(p => {
          const checked = selected.includes(p.id)
          return (
            <div key={p.id} className={styles.row} onClick={() => {
              setSelected(prev => checked ? prev.filter(x => x !== p.id) : [...prev, p.id])
            }}>
              <div className={styles.nameCell}>
                <div className={checked ? styles.cbOn : styles.cbOff} aria-hidden="true">{checked ? '✓' : ''}</div>
                <div className={styles.thumb} aria-hidden="true" />
                <div>
                  <div className={styles.planName}>{p.name}</div>
                  <div className={styles.planDesc}>This is a description for th…</div>
                </div>
              </div>
              <div>{p.beds}</div>
              <div>{p.baths}</div>
              <div>{p.aru}</div>
            </div>
          )
        })}
      </div>
    </BaseModal>
  )
}
