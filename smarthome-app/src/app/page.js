'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css'

export default function Login() {
  const router = useRouter();

  return (
    <div>
      <p>Siema</p>
      <button type="button" onClick={() => router.push('/Home')}>
        homepage
      </button>
    </div>
  )
}