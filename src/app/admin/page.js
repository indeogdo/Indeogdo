'use client';

import IconBoard from '@/components/admin/IconBoard';
import CreditBoard from '@/components/admin/CreditBoard';
import SettingBoard from '@/components/admin/SettingBoard';

export default function AdminPage() {
  return (
    <>
      <IconBoard />
      <CreditBoard />
      <SettingBoard />
    </>
  );
}