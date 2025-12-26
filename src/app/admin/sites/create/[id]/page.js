'use client';

import BoardEditContainer from '@/container/BoardEditContainer';
import { use } from 'react';

export default function SiteCreatePage({ params }) {
  const { id } = use(params);
  console.log(id);
  return (
    <BoardEditContainer clusterId={id} />
  );
}