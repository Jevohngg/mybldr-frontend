import React from 'react'
import BaseModal from '../BaseModal/BaseModal'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import type { Community } from '../../../app/providers'
import styles from '../AddCommunityModal/AddCommunityModal.module.css'

interface EditCommunityModalProps {
  open: boolean
  onClose: () => void
  onSave: (payload: Partial<Community>) => void
  community: Community
}

export default function EditCommunityModal({
  open,
  onClose,
  onSave,
  community,
}: EditCommunityModalProps) {
  const [name, setName] = React.useState('')
  const [communityId, setCommunityId] = React.useState('')
  const [zipCode, setZipCode] = React.useState('')
  const [numberOfLots, setNumberOfLots] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [numberOfPhases, setNumberOfPhases] = React.useState('')
  const [division, setDivision] = React.useState('')
  const [zone, setZone] = React.useState('')
  const [masterPlan, setMasterPlan] = React.useState('')

  React.useEffect(() => {
    if (open && community) {
      setName(community.name || '')
      setCommunityId(community.id || '')
      setZipCode('99843')
      setNumberOfLots(String(community.lots) || '')
      setStartDate('')
      setNumberOfPhases('')
      setDivision(community.division || '')
      setZone('')
      setMasterPlan('244433')
    }
  }, [open, community])

  const handleSave = () => {
    onSave({
      name,
      division,
      lots: parseInt(numberOfLots) || 0,
    })
    onClose()
  }

  const footer = (
    <div className={styles.footerRow}>
      <Button onClick={onClose}>Cancel</Button>
      <Button variant="primary" onClick={handleSave}>Save</Button>
    </div>
  )

  return (
    <BaseModal open={open} title="Edit Community Details" onClose={onClose} footer={footer} width={600}>
      <div className={styles.details}>
        <div className={styles.field}>
          <div className="label">Name</div>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter community name" />
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <div className="label">ID</div>
            <Input placeholder="Enter ID" value={communityId} onChange={(e) => setCommunityId(e.target.value)} />
          </div>
          <div className={styles.field}>
            <div className="label">Zip Code</div>
            <Input placeholder="Enter zip code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
          </div>

          <div className={styles.field}>
            <div className="label">Expected Start Date</div>
            <Input placeholder="Enter Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} type="text" />
          </div>
          <div className={styles.field}>
            <div className="label">Number of Lots</div>
            <Input placeholder="Enter number of lots" value={numberOfLots} onChange={(e) => setNumberOfLots(e.target.value)} />
          </div>

          <div className={styles.field}>
            <div className="label">Number of Phases</div>
            <Input placeholder="Enter number of phases" value={numberOfPhases} onChange={(e) => setNumberOfPhases(e.target.value)} />
          </div>
          <div className={styles.field}>
            <div className="label">Division</div>
            <Input placeholder="Enter division" value={division} onChange={(e) => setDivision(e.target.value)} />
          </div>

          <div className={styles.field}>
            <div className="label">Zone</div>
            <select className="select" value={zone} onChange={(e) => setZone(e.target.value)}>
              <option value="">Select zone</option>
              <option value="Lorem Ipsum">Lorem Ipsum</option>
            </select>
          </div>
          <div className={styles.field}>
            <div className="label">Master Plan Number</div>
            <Input placeholder="Enter master plan number" value={masterPlan} onChange={(e) => setMasterPlan(e.target.value)} />
          </div>
        </div>

        <div className={styles.mapSection}>
          <div className={styles.mapCard}>
            <img src="/assets/maps/placeholder2.png" alt="Community map preview" className={styles.mapPh} />
            <div className={styles.mapCaption}>
              <div className={styles.mapCaptionTitle}>Community map</div>
              <div className={styles.mapCaptionSub}>This was generated based on the map you uploaded.</div>
            </div>
          </div>
          <div className={styles.fileRow}>
            <div className={styles.fileLeft}>
              <img src="/assets/pdf.png" alt="PDF" className={styles.pdf} />
              <div>
                <div className={styles.fileName}>community_map.pdf</div>
                <div className={styles.fileSize}>100kb</div>
              </div>
            </div>
            <Button>Update</Button>
          </div>
        </div>
      </div>
    </BaseModal>
  )
}
