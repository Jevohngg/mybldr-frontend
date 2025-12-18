import React from 'react'
import BaseModal from '../BaseModal/BaseModal'
import Button from '../../ui/Button'
import Input from '../../ui/Input'
import styles from './AddCommunityModal.module.css'

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
    specs: number
    lots: number
  }) => void
}) {
  const [step, setStep] = React.useState<Step>('upload')
  const [name, setName] = React.useState('')
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
    onSave({
      name,
      division,
      plans: 0,
      specs: 0,
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
        <div className="label">Community Name</div>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter community name" />
      </div>

      {step === 'upload' && (
        <div className={styles.uploadCard}>
          <div className={styles.drop}>
            <div className={styles.dropInner}>
              <div className={styles.big}>Community planning in minutes not months</div>
              <div className={styles.small}>
                <span className={styles.link} onClick={() => { setHasUploadedFile(true); setStep('generating'); }}>Upload</span> your community map and speed up planning with an interactive community map.
              </div>
            </div>
          </div>
          <button className={styles.manual} onClick={() => { setHasUploadedFile(false); setStep('details'); }}>Enter details manually</button>
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

          <div className={styles.continueRow}>
            <button className={styles.manualLink} onClick={() => setStep('details')}>Enter details manually</button>
          </div>
        </div>
      )}

      {step === 'details' && (
        <div className={styles.details}>
          {hasUploadedFile ? (
            <>
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
            </>
          ) : (
            <div className={styles.uploadCard}>
              <div className={styles.drop}>
                <div className={styles.dropInner}>
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
