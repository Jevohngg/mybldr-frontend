import React from 'react'
import Button from '../../ui/Button'
import styles from './TitleBlockInfo.module.css'

export default function TitleBlockInfo() {
  const [buildingCodes, setBuildingCodes] = React.useState(['2021 IRC', '2023 NEC'])
  const [adaCompliant, setAdaCompliant] = React.useState('no')

  const removeCode = (code: string) => {
    setBuildingCodes(buildingCodes.filter(c => c !== code))
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Title Block Info</h3>

      <div className={styles.section}>
        <label className={styles.label}>Version</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter version"
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Building codes</label>
        <div className={styles.tagsContainer}>
          {buildingCodes.map((code) => (
            <div key={code} className={styles.tag}>
              <span>{code}</span>
              <Button
                variant="ghost"
                size="xs"
                iconOnly
                className={styles.tagRemove}
                onClick={() => removeCode(code)}
                aria-label={`Remove ${code}`}
              >
                ×
              </Button>
            </div>
          ))}
          <button className={styles.dropdownBtn}>
            <img src="/assets/icons/chevron-down.svg" alt="" width="12" height="8" />
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Permit number</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter Permit Number"
        />
      </div>

      <div className={styles.dateRow}>
        <div className={styles.dateField}>
          <label className={styles.label}>Issued</label>
          <div className={styles.dateInput}>
            <img src="/assets/icons/calendar.svg" alt="" width="16" height="16" className={styles.dateIcon} />
            <span className={styles.datePlaceholder}>11/22...</span>
          </div>
        </div>
        <div className={styles.dateField}>
          <label className={styles.label}>Expires</label>
          <div className={styles.dateInput}>
            <img src="/assets/icons/calendar.svg" alt="" width="16" height="16" className={styles.dateIcon} />
            <span className={styles.datePlaceholder}>11/22...</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>Governing Body</label>
        <input
          type="text"
          className={styles.input}
          placeholder="Enter Municipality"
        />
      </div>

      <div className={styles.section}>
        <label className={styles.label}>State</label>
        <select className={styles.select}>
          <option>--</option>
          <option>Alabama</option>
          <option>Alaska</option>
          <option>Arizona</option>
          <option>Arkansas</option>
          <option>California</option>
          <option>Colorado</option>
          <option>Connecticut</option>
          <option>Delaware</option>
          <option>Florida</option>
          <option>Georgia</option>
        </select>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>ADA Compliant</label>
        <div className={styles.radioGroup}>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="ada"
              value="yes"
              checked={adaCompliant === 'yes'}
              onChange={() => setAdaCompliant('yes')}
              className={styles.radioInput}
            />
            <span className={styles.radioText}>Yes</span>
          </label>
          <label className={styles.radioLabel}>
            <input
              type="radio"
              name="ada"
              value="no"
              checked={adaCompliant === 'no'}
              onChange={() => setAdaCompliant('no')}
              className={styles.radioInput}
            />
            <span className={styles.radioText}>No</span>
          </label>
        </div>
      </div>
    </div>
  )
}
