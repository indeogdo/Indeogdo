'use client';

import { useState, useEffect, useRef } from 'react';
import * as S from '@/styles/Navigation/navigation.style';
import EditButton from '@/components/admin/EditButton';
import SiteSection from '@/components/Navigation/SiteSection';
import useSites from '@/hooks/useSites';
import useCluster from '@/hooks/useCluster';
import useClusterSitesStore from '@/stores/clusterSitesStore';
import AddButton from '@/components/admin/AddButton';
import { useRouter, usePathname } from 'next/navigation';
import SiteItem from '@/components/Navigation/SiteItem';

function ClusterItem({ cluster, isAdmin, themeId }) {
  const { fetchSitesByCluster } = useSites();
  const { updateCluster, deleteCluster } = useCluster();
  const setClusterSites = useClusterSitesStore((state) => state.setClusterSites);
  const removeClusterSites = useClusterSitesStore((state) => state.removeClusterSites);
  // 인덕도 cluster는 초기 로드 시 활성화
  const INDEOGDO_CLUSTER_ID = 'c3215e24-0b9c-4e09-825d-18657bf4a0ba';
  const router = useRouter();
  const pathname = usePathname();
  const [isActive, setIsActive] = useState(false);
  const [sites, setSites] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [isUpdatingIntro, setIsUpdatingIntro] = useState(false);
  const [isUpdatingVisibility, setIsUpdatingVisibility] = useState(false);
  const [isUpdatingAddress, setIsUpdatingAddress] = useState(false);
  const [localIntro, setLocalIntro] = useState(Boolean(cluster?.intro));
  const [localToggle, setLocalToggle] = useState(Boolean(cluster?.toggle));
  const [localAddress, setLocalAddress] = useState(
    cluster?.address === undefined ? true : Boolean(cluster.address)
  );
  const [isExpanded, setIsExpanded] = useState(true);
  const introNavigationRef = useRef(null);
  const resolvedThemeId = themeId || cluster?.theme_id || null;

  // 홈페이지(/)에서만 인덕도 클러스터 초기 활성화
  useEffect(() => {
    if (pathname === '/' && cluster.id === INDEOGDO_CLUSTER_ID) {
      setIsActive(true);
    }
  }, [pathname, cluster.id]);
  useEffect(() => {
    setLocalIntro(Boolean(cluster?.intro));
    setLocalToggle(Boolean(cluster?.toggle));
    setLocalAddress(cluster?.address === undefined ? true : Boolean(cluster.address));
  }, [cluster?.intro, cluster?.toggle, cluster?.address]);


  // 클러스터 활성화 시 sites 가져오기
  useEffect(() => {
    if (isActive) {
      if (sites.length === 0) {
        const loadSites = async () => {
          const fetchedSites = await fetchSitesByCluster(cluster.id);
          if (fetchedSites) {
            setSites(fetchedSites);
            // 전역 store에 sites 업데이트
            setClusterSites(cluster.id, fetchedSites);
          }
        };
        loadSites();
      } else {
        // 이미 sites가 있으면 바로 전역 store에 업데이트
        setClusterSites(cluster.id, sites);
      }
    } else {
      // 비활성화 시 전역 store에서 제거
      removeClusterSites(cluster.id);
      introNavigationRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, cluster.id]);

  // sites가 변경되면 전역 store 업데이트 (활성화 상태일 때만)
  useEffect(() => {
    if (isActive && sites.length > 0) {
      setClusterSites(cluster.id, sites);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sites]);

  useEffect(() => {
    if (!isActive || !cluster?.intro || pathname?.startsWith('/admin')) {
      if (!isActive) {
        introNavigationRef.current = null;
      }
      return;
    }

    // 이미 특정 사이트 페이지에 있으면 자동 이동하지 않음

    if (!sites || sites.length === 0) return;
    const firstSite = sites[0];
    if (!firstSite?.id) return;
    if (introNavigationRef.current === firstSite.id) return;

    introNavigationRef.current = firstSite.id;
    router.push(`/sites/${firstSite.id}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, cluster?.intro, sites, pathname]);

  const handleToggle = (e) => {
    e.stopPropagation();
    setIsActive(prev => !prev);
  };

  const handleToggleExpand = (e) => {
    e.stopPropagation();
    if (!isEditing) {
      setIsExpanded(prev => !prev);
    }
  };

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingTitle(cluster.title);
  };

  const handleSaveEdit = async (e) => {
    e?.stopPropagation();
    if (!editingTitle.trim()) return;
    try {
      const result = await updateCluster(cluster.id, editingTitle.trim(), themeId);
      if (result) {
        setIsEditing(false);
        setEditingTitle('');
        alert(`"${cluster.title}" 주제 이름이 수정되었습니다.`);
      } else {
        alert(`"${cluster.title}" 주제 이름 수정에 실패했습니다.`);
      }
    } catch (err) {
      console.error('Update subject error:', err);
      alert(`"${cluster.title}" 주제 이름 수정 중 오류가 발생했습니다.`);
    }
  };

  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(false);
    setEditingTitle('');
  };

  const handleDelete = async (e) => {
    e?.stopPropagation();
    if (!confirm(`"${cluster.title}" 주제를 삭제하시겠습니까?\n\n**주의**\n아래에 포함된 장소들도 함께 삭제됩니다. \n장소를 다른 주제에 옮기고 수행해주세요\n\n이 작업은 되돌릴 수 없습니다.`)) return;
    try {
      const result = await deleteCluster(cluster.id);
      if (result) {
        alert(`"${cluster.title}" 주제가 삭제되었습니다.`);
      }
    } catch (err) {
      console.error('Delete subject error:', err);
      const errorMsg = err.message || `"${cluster.title}" 주제 삭제에 실패했습니다.`;
      const details = err.details || '';
      const fullMessage = details ? `${errorMsg}\n\n${details}` : errorMsg;
      alert(fullMessage);
    }
  };

  const handleStartAddSite = () => {
    router.push(`/admin/sites/create/${cluster.id}`);
  };

  const handleOrder = (e) => {
    e?.stopPropagation();
    setIsOrdering(prev => !prev);
  };

  const handleToggleIntroSetting = async (e) => {
    e?.stopPropagation();
    if (isUpdatingIntro) return;

    const nextIntro = !localIntro;
    setLocalIntro(nextIntro);
    setIsUpdatingIntro(true);
    try {
      await updateCluster(
        cluster.id,
        cluster.title,
        resolvedThemeId || undefined,
        undefined,
        nextIntro,
        localToggle,
        localAddress,
      );
    } catch (err) {
      console.error('Toggle intro setting error:', err);
      alert('인트로 표시 설정을 변경하는 중 오류가 발생했습니다.');
      setLocalIntro(!nextIntro);
    } finally {
      setIsUpdatingIntro(false);
    }
  };

  const handleToggleVisibilitySetting = async (e) => {
    e?.stopPropagation();
    if (isUpdatingVisibility) return;

    const nextToggle = !localToggle;
    setLocalToggle(nextToggle);
    setIsUpdatingVisibility(true);
    try {
      await updateCluster(
        cluster.id,
        cluster.title,
        resolvedThemeId || undefined,
        undefined,
        localIntro,
        nextToggle,
        localAddress,
      );
    } catch (err) {
      console.error('Toggle visibility setting error:', err);
      alert('장소 표시 설정을 변경하는 중 오류가 발생했습니다.');
      setLocalToggle(!nextToggle);
    } finally {
      setIsUpdatingVisibility(false);
    }
  };

  const handleToggleAddressSetting = async (e) => {
    e?.stopPropagation();
    if (isUpdatingAddress) return;

    const nextAddress = !localAddress;
    setLocalAddress(nextAddress);
    setIsUpdatingAddress(true);
    try {
      await updateCluster(
        cluster.id,
        cluster.title,
        resolvedThemeId || undefined,
        undefined,
        localIntro,
        localToggle,
        nextAddress,
      );
    } catch (err) {
      console.error('Toggle address setting error:', err);
      alert('상세 주소 표시 설정을 변경하는 중 오류가 발생했습니다.');
      setLocalAddress(!nextAddress);
    } finally {
      setIsUpdatingAddress(false);
    }
  };

  return (
    <S.ClusterContainer>
      <S.ClusterItem
        $isActive={isActive}
        onClick={handleToggle}
      >
        <S.ToggleSwitch $isActive={isActive}>
          <S.ToggleSlider $isActive={isActive} />
        </S.ToggleSwitch>
        {isEditing ? (
          <S.ClusterTitleInput
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveEdit(e);
              else if (e.key === 'Escape') handleCancelEdit(e);
            }}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
        ) : (
          <S.ClusterTitle $isActive={isActive}>{cluster.title}</S.ClusterTitle>
        )}
        {isAdmin && (
          isEditing ? (
            <S.EditActionButtons>
              <S.SaveButton onClick={handleSaveEdit}>저장</S.SaveButton>
              <S.CancelButton onClick={handleCancelEdit}>취소</S.CancelButton>
            </S.EditActionButtons>
          ) : (
            <>
              <EditButton onEdit={handleStartEdit} onDelete={handleDelete} onOrder={handleOrder} text="장소" />
              <S.ExpandIcon $isExpanded={isExpanded} onClick={handleToggleExpand} style={{ marginTop: '-0.5px', marginBottom: '10px' }}>
                {isExpanded ? '▲' : '▼'}
              </S.ExpandIcon>
            </>
          )
        )}
      </S.ClusterItem>

      {!isAdmin && cluster?.toggle && (
        <SiteItem clusterId={cluster.id} isActive={isActive} />
      )}

      {isAdmin && isExpanded && (
        <>
          <S.ClusterSettingWrapper>
            <S.ClusterSettingList>
              <S.ClusterSettingItem>
                인트로
                <S.ClusterSettingButton
                  type="checkbox"
                  checked={localIntro}
                  onChange={handleToggleIntroSetting}
                  disabled={isUpdatingIntro}
                />
              </S.ClusterSettingItem>
              <S.ClusterSettingItem>
                리스트 펼치기
                <S.ClusterSettingButton
                  type="checkbox"
                  checked={localToggle}
                  onChange={handleToggleVisibilitySetting}
                  disabled={isUpdatingVisibility}
                />
              </S.ClusterSettingItem>
              <S.ClusterSettingItem>
                상세 주소 숨기기
                <S.ClusterSettingButton
                  type="checkbox"
                  checked={localAddress}
                  onChange={handleToggleAddressSetting}
                  disabled={isUpdatingAddress}
                />
              </S.ClusterSettingItem>
            </S.ClusterSettingList>
          </S.ClusterSettingWrapper>
          <SiteSection
            clusterId={cluster.id}
            isAdmin={isAdmin}
            isOrdering={isOrdering}
            onOrderChange={() => setIsOrdering(false)}
          />
          <div style={{ width: '100px', display: 'flex', margin: '10px 0px 24px 46px', transform: 'scale(0.9)' }}>
            <AddButton onClick={handleStartAddSite}>
              <span>+</span>
              <span>장소 추가</span>
            </AddButton>
          </div>
        </>
      )}
    </S.ClusterContainer>
  );
}

export default ClusterItem;

