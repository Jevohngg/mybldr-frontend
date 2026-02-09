import React from 'react'
import BaseModal from '../BaseModal/BaseModal'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import styles from './AddCommunityModal.module.css'
import mediaCard from '../../shared/MediaCard/MediaCard.module.css'

type Step = 'upload' | 'generating' | 'details'

export default function AddCommunityModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean
  onClose: () => void
  onSave: (payload: {
    name: string
    division: string
    plans: number
    specs: string
    lots: number
  }) => void
}) {
  const [step, setStep] = React.useState<Step>('upload')
  const [name, setName] = React.useState('')
  const [nameError, setNameError] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [hasUploadedFile, setHasUploadedFile] = React.useState(false)

  const [communityId, setCommunityId] = React.useState('')
  const [zipCode, setZipCode] = React.useState('')
  const [numberOfLots, setNumberOfLots] = React.useState('')
  const [startDate, setStartDate] = React.useState('')
  const [numberOfPhases, setNumberOfPhases] = React.useState('')
  const [division, setDivision] = React.useState('')
  const [zone, setZone] = React.useState('')
  const [masterPlan, setMasterPlan] = React.useState('')

  React.useEffect(() => {
    if (!open) return
    setStep('upload')
    setName('')
    setNameError(false)
    setProgress(0)
    setHasUploadedFile(false)
    setCommunityId('')
    setZipCode('')
    setNumberOfLots('')
    setStartDate('')
    setNumberOfPhases('')
    setDivision('')
    setZone('')
    setMasterPlan('')
  }, [open])

  React.useEffect(() => {
    if (hasUploadedFile && step === 'details') {
      setCommunityId('44332')
      setZipCode('99843')
      setNumberOfLots('104')
      setDivision('Northwestern')
      setZone('Lorem Ipsum')
      setMasterPlan('Northwestern')
    }
  }, [hasUploadedFile, step])

  React.useEffect(() => {
    if (step !== 'generating') return

    setProgress(0)
    const duration = 3000
    const interval = 50
    const increment = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [step])

  React.useEffect(() => {
    if (progress >= 100 && step === 'generating') {
      const timer = setTimeout(() => {
        setStep('details')
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [progress, step])

  const handleSave = () => {
    if (!name.trim()) {
      setNameError(true)
      return
    }
    onSave({
      name,
      division,
      plans: 0,
      specs: '',
      lots: parseInt(numberOfLots) || 0,
    })
  }

  const footer = (
    <div className={styles.footerRow}>
      {step === 'details' ? (
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </>
      ) : (
        <Button onClick={onClose}>Close</Button>
      )}
    </div>
  )

  return (
    <BaseModal open={open} title="Add Community" onClose={onClose} footer={step === 'details' ? footer : undefined} width={880}>
      <div className={styles.field}>
        <div className="label">Community Name <span className={styles.required}>*</span></div>
        <Input
          value={name}
          onChange={(e) => { setName(e.target.value); setNameError(false) }}
          placeholder="Enter community name"
          className={nameError ? styles.inputError : ''}
        />
        {nameError && <div className={styles.errorText}>Community name is required</div>}
      </div>

      {step === 'upload' && (
        <div className={styles.uploadCard}>
          <div className={styles.drop}>
            <div className={styles.dropInner}>
              <img src="/assets/upload-hero.png" alt="Upload files" className={styles.heroGraphic} />
              <div className={styles.big}>Community planning in minutes not months</div>
              <div className={styles.small}>
                <span className={styles.link} onClick={() => { setHasUploadedFile(true); setStep('generating'); }}>Upload</span> your community map and speed up planning with an interactive community map.
              </div>
            </div>
          </div>
          <Button variant="link" className={styles.manual} onClick={() => { setHasUploadedFile(false); setStep('details'); }}>Enter details manually</Button>
        </div>
      )}

      {step === 'generating' && (
        <div className={styles.genCard}>
          <div className={styles.preview}>
            {/* TODO: place uploaded map preview placeholder at public/assets/maps/upload-preview.png */}
            <div className={styles.previewPh}>Uploaded map preview</div>
          </div>
          <div className={styles.genText}>
            <div className={styles.genTitle}>Generating community map</div>
            <div className={styles.genSub}>Analyzing project. You can close this window…</div>
            <div className={styles.progressWrapper}>
              <div className={styles.progress}>
                <div className={styles.bar} style={{ width: `${progress}%` }} />
              </div>
              <div className={styles.progressLabel}>{Math.round(progress)}%</div>
            </div>
          </div>

          <div className={mediaCard.mediaCardFileRow}>
            <img src="/assets/pdf.png" alt="PDF" className={mediaCard.mediaCardFileIcon} />
            <div className={mediaCard.mediaCardFileInfo}>
              <div className={mediaCard.mediaCardFileName}>community_map.pdf</div>
              <div className={mediaCard.mediaCardFileSize}>100kb</div>
            </div>
            <Button>Update</Button>
          </div>

          <div className={styles.continueRow}>
            <Button variant="link" className={styles.manualLink} onClick={() => setStep('details')}>Enter details manually</Button>
          </div>
        </div>
      )}

      {step === 'details' && (
        <div className={styles.details}>
          {hasUploadedFile ? (
            <div className={styles.mapSection}>
              <div className={mediaCard.mediaCardImage}>
                <img src="/assets/maps/placeholder2.png" alt="Community map preview" />
              </div>
              <div className={mediaCard.mediaCardInfo}>
                <div className={mediaCard.mediaCardText}>
                  <div className={mediaCard.mediaCardTitle}>Community map</div>
                  <div className={mediaCard.mediaCardDescription}>This was generated based on the map you uploaded.</div>
                </div>
              </div>
              <div className={mediaCard.mediaCardFileRow}>
                <img src="/assets/pdf.png" alt="PDF" className={mediaCard.mediaCardFileIcon} />
                <div className={mediaCard.mediaCardFileInfo}>
                  <div className={mediaCard.mediaCardFileName}>community_map.pdf</div>
                  <div className={mediaCard.mediaCardFileSize}>100kb</div>
                </div>
                <Button onClick={() => setHasUploadedFile(false)}>Update</Button>
              </div>
            </div>
          ) : (
            <div className={styles.uploadCard}>
              <div className={styles.drop}>
                <div className={styles.dropInner}>
                  <img src="/assets/upload-hero.png" alt="Upload files" className={styles.heroGraphic} />
                  <div className={styles.big}>Community planning in minutes not months</div>
                  <div className={styles.small}>
                    <span className={styles.link} onClick={() => { setHasUploadedFile(true); setStep('generating'); }}>Upload</span> your community map and speed up planning with an interactive community map.
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className={styles.sectionTitle}>Community details</div>

          <div className={styles.grid}>
            <div className={styles.field}><div className="label">Community ID</div><Input placeholder="Enter ID" value={communityId} onChange={(e) => setCommunityId(e.target.value)} /></div>
            <div className={styles.field}><div className="label">Zip Code</div><Input placeholder="Enter zip code" value={zipCode} onChange={(e) => setZipCode(e.target.value)} /></div>

            <div className={styles.field}><div className="label">Number of Lots</div><Input placeholder="Enter number of lots" value={numberOfLots} onChange={(e) => setNumberOfLots(e.target.value)} /></div>
            <div className={styles.field}><div className="label">Expected Start Date</div><Input placeholder="Enter Date" value={startDate} onChange={(e) => setStartDate(e.target.value)} /></div>

            <div className={styles.field}><div className="label">Number of Phases</div><Input placeholder="Enter number of phases" value={numberOfPhases} onChange={(e) => setNumberOfPhases(e.target.value)} /></div>
            <div className={styles.field}><div className="label">Division</div><Input placeholder="Enter division" value={division} onChange={(e) => setDivision(e.target.value)} /></div>

            <div className={styles.field}><div className="label">Zone</div><select className="select" value={zone} onChange={(e) => setZone(e.target.value)}><option value="">Select zone</option><option value="Lorem Ipsum">Lorem Ipsum</option></select></div>
            <div className={styles.field}><div className="label">Master Plan #</div><Input placeholder="Enter master plan number" value={masterPlan} onChange={(e) => setMasterPlan(e.target.value)} /></div>
          </div>
        </div>
      )}
    </BaseModal>
  )
}
