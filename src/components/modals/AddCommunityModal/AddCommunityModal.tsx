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
  onSave: (payload: { name: string }) => void
}) {
  const [step, setStep] = React.useState<Step>('upload')
  const [name, setName] = React.useState('')
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    if (!open) return
    setStep('upload')
    setName('')
    setProgress(0)
  }, [open])

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

  const footer = (
    <div className={styles.footerRow}>
      {step === 'details' ? (
        <>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={() => onSave({ name })}>Save</Button>
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
                <span className={styles.link} onClick={() => setStep('generating')}>Upload</span> your community map and speed up planning with an interactive community map.
              </div>
            </div>
          </div>
          <button className={styles.manual} onClick={() => setStep('details')}>Enter details manually</button>
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
              <div className={styles.pdf}>PDF</div>
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
          <div className={styles.mapCard}>
            <div className={styles.mapPh}>Generated community map preview</div>
            <div className={styles.mapCaption}>
              <div className={styles.mapCaptionTitle}>Community map</div>
              <div className={styles.mapCaptionSub}>This was generated based on the map you uploaded.</div>
            </div>
            <div className={styles.fileRow}>
              <div className={styles.fileLeft}>
                <div className={styles.pdf}>PDF</div>
                <div>
                  <div className={styles.fileName}>community_map.pdf</div>
                  <div className={styles.fileSize}>100kb</div>
                </div>
              </div>
              <Button>Update</Button>
            </div>
          </div>

          <div className={styles.sectionTitle}>Community details</div>

          <div className={styles.grid}>
            <div className={styles.field}><div className="label">Community ID</div><Input defaultValue="44332" /></div>
            <div className={styles.field}><div className="label">Zip Code</div><Input defaultValue="99843" /></div>

            <div className={styles.field}><div className="label">Number of Lots</div><Input defaultValue="104" /></div>
            <div className={styles.field}><div className="label">Expected Start Date</div><Input placeholder="Enter Date" /></div>

            <div className={styles.field}><div className="label">Number of Phases</div><Input placeholder="Enter number of phases" /></div>
            <div className={styles.field}><div className="label">Division</div><Input defaultValue="Northwestern" /></div>

            <div className={styles.field}><div className="label">Zone</div><select className="select"><option>Lorem Ipsum</option></select></div>
            <div className={styles.field}><div className="label">Master Plan #</div><Input defaultValue="Northwestern" /></div>
          </div>
        </div>
      )}
    </BaseModal>
  )
}
