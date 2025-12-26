'use client';

import { useState, useEffect } from 'react';
import * as S from '@/styles/Navigation/navigation.style';
import EditButton from '@/components/admin/EditButton';
import { useRouter } from 'next/navigation';
import useSites from '@/hooks/useSites';

function SiteSection({ clusterId, isAdmin, isOrdering, onOrderChange }) {
  const router = useRouter();
  const { deleteSite, fetchSitesByCluster, updateSite } = useSites();
  const [sites, setSites] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Admin 모드일 때 sites 데이터 가져오기
  useEffect(() => {
    if (isAdmin && clusterId) {
      const loadSites = async () => {
        const fetchedSites = await fetchSitesByCluster(clusterId);
        if (fetchedSites) {
          setSites(fetchedSites);
        }
      };
      loadSites();
    }
  }, [isAdmin, clusterId, fetchSitesByCluster]);

  const handleEditSite = (site) => {
    router.push(`/admin/sites/${site.id}/edit`);
  };

  const handleDeleteSite = async (site) => {
    if (!site) return;
    if (!confirm(`"${site.title}" 장소를 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`)) return;
    const result = await deleteSite(site.id);
    if (result) {
      // 삭제 성공 시 로컬 상태에서 제거
      setSites(prev => prev.filter(s => s.id !== site.id));
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setSites(prev => {
      const newSites = [...prev];
      [newSites[index - 1], newSites[index]] = [newSites[index], newSites[index - 1]];
      return newSites;
    });
  };

  const handleMoveDown = (index) => {
    if (index === sites.length - 1) return;
    setSites(prev => {
      const newSites = [...prev];
      [newSites[index], newSites[index + 1]] = [newSites[index + 1], newSites[index]];
      return newSites;
    });
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      // 모든 site를 순서대로 업데이트 (1, 2, 3, 4...)
      // 기존 데이터는 유지하고 order만 업데이트
      const updatePromises = sites.map((site, index) =>
        updateSite(site.id, {
          title: site.title,
          contents: site.contents || [],
          cluster_id: site.cluster?.id || site.cluster_id,
          icon_id: site.icon?.id || site.icon_id || null,
          order: index + 1
        })
      );

      await Promise.all(updatePromises);

      // 데이터 새로고침
      const fetchedSites = await fetchSitesByCluster(clusterId);
      if (fetchedSites) {
        setSites(fetchedSites);
      }

      alert('순서가 저장되었습니다.');
      if (onOrderChange) {
        onOrderChange();
      }
    } catch (err) {
      console.error('Save order error:', err);
      alert('순서 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelOrder = () => {
    // 데이터 새로고침으로 원래 순서로 복원
    const loadSites = async () => {
      const fetchedSites = await fetchSitesByCluster(clusterId);
      if (fetchedSites) {
        setSites(fetchedSites);
      }
    };
    loadSites();
    if (onOrderChange) {
      onOrderChange();
    }
  };

  if (!isAdmin || !sites || sites.length === 0) return null;

  return (
    <>
      {isOrdering && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '8px 0', marginLeft: 'auto', marginBottom: '-10px', marginRight: '5px' }}>
          <S.SaveButton onClick={handleSaveOrder} disabled={isSaving}>
            {isSaving ? '저장 중...' : '순서 저장'}
          </S.SaveButton>
          <S.CancelButton onClick={handleCancelOrder} disabled={isSaving}>
            취소
          </S.CancelButton>
        </div>
      )}
      <S.AdminSiteList>
        {sites.map((site, index) => (
          <S.AdminSiteItem key={site.id}>
            {isOrdering ? (
              <>
                <S.SiteIcon src={site.icon?.img || undefined} alt={site.title} />
                <S.SiteTitle>{site.title}</S.SiteTitle>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <S.OrderButton
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </S.OrderButton>
                  <S.OrderButton
                    onClick={() => handleMoveDown(index)}
                    disabled={index === sites.length - 1}
                  >
                    ↓
                  </S.OrderButton>
                </div>
              </>
            ) : (
              <>
                <S.AdminSiteIcon src={site.icon?.img || undefined} alt={site.title} />
                <S.AdminSiteTitle>{site.title}</S.AdminSiteTitle>
                <EditButton onEdit={() => handleEditSite(site)} onDelete={() => handleDeleteSite(site)} hidden={true} />
              </>
            )}
          </S.AdminSiteItem>
        ))}
      </S.AdminSiteList>
    </>
  );
}

export default SiteSection;


