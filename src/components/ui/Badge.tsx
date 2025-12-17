import styles from './Badge.module.css'

export default function Badge({ tone = 'neutral', children }: { tone?: 'neutral' | 'success'; children: React.ReactNode }) {
  return <span className={tone === 'success' ? styles.success : styles.neutral}>{children}</span>
}
