'use client';

import { useState, useMemo, useEffect } from 'react';
import * as S from '@/styles/Navigation/navigation.style';
import AddButton from '@/components/admin/AddButton';
import ClusterItem from '@/components/Navigation/ClusterItem';
import useCluster from '@/hooks/useCluster';
import { useSyncSitesToMap } from '@/stores/clusterSitesStore';

function ClusterSection({
  themeId,
  isAdmin,
  isOrdering,
  onOrderChange,
}) {
  const { clusters, loading: clusterLoading, createCluster, updateCluster, fetchClusters } = useCluster();
  const [isAdding, setIsAdding] = useState(false);
  const [newClusterTitle, setNewClusterTitle] = useState('');
  const [localClusters, setLocalClusters] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // 전역 store의 sites 변경을 지도에 동기화
  useSyncSitesToMap();

  // 현재 themeId에 해당하는 clusters 필터링
  const themeClusters = useMemo(() => {
    return clusters.filter(cluster => cluster.theme_id === themeId);
  }, [clusters, themeId]);

  // 순서 변경 모드일 때 로컬 상태로 clusters 관리
  useEffect(() => {
    if (isOrdering) {
      setLocalClusters([...themeClusters]);
    }
  }, [isOrdering, themeClusters]);

  // 기본적으로는 themeClusters 사용, 순서 변경 모드일 때는 localClusters 사용
  const displayClusters = isOrdering ? localClusters : themeClusters;

  const handleStartAddCluster = () => {
    setIsAdding(true);
    setNewClusterTitle('');
  };

  const handleCreateCluster = async () => {
    if (!themeId || !newClusterTitle.trim()) return;
    try {
      const result = await createCluster(newClusterTitle.trim(), themeId);
      if (result) {
        setNewClusterTitle('');
        setIsAdding(false);
        alert('새로운 주제가 생성되었습니다.');
      } else {
        alert('주제 생성에 실패했습니다.');
      }
    } catch (e) {
      console.error('Create subject error:', e);
      alert('주제 생성 중 오류가 발생했습니다.');
    }
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setLocalClusters(prev => {
      const newClusters = [...prev];
      [newClusters[index - 1], newClusters[index]] = [newClusters[index], newClusters[index - 1]];
      return newClusters;
    });
  };

  const handleMoveDown = (index) => {
    if (index === localClusters.length - 1) return;
    setLocalClusters(prev => {
      const newClusters = [...prev];
      [newClusters[index], newClusters[index + 1]] = [newClusters[index + 1], newClusters[index]];
      return newClusters;
    });
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      // 모든 cluster를 순서대로 업데이트 (1, 2, 3, 4...)
      // 기존 데이터는 유지하고 order만 업데이트
      const updatePromises = localClusters.map((cluster, index) =>
        updateCluster(cluster.id, cluster.title, themeId, index + 1)
      );

      await Promise.all(updatePromises);

      // 데이터 새로고침 - 전체 clusters 목록 다시 가져오기
      await fetchClusters();

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
    // 원래 순서로 복원
    setLocalClusters([...themeClusters]);
    if (onOrderChange) {
      onOrderChange();
    }
  };


  return (
    <>
      {isOrdering && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginLeft: 'auto', marginRight: '9px', marginTop: '-10px', marginBottom: '12px' }}>
          <S.SaveButton onClick={handleSaveOrder} disabled={isSaving}>
            {isSaving ? '저장 중...' : '순서 저장'}
          </S.SaveButton>
          <S.CancelButton onClick={handleCancelOrder} disabled={isSaving}>
            취소
          </S.CancelButton>
        </div>
      )}
      {isAdmin && !isOrdering && (
        <div style={{ marginBottom: '18px', marginTop: '-4px' }}>
          <AddButton onClick={(e) => { e.stopPropagation(); handleStartAddCluster(); }} >
            <span>+</span>
            <span>추가하기</span>
          </AddButton>
          {isAdding && (
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', margin: '6px 4px 6px 0px' }}>
              <S.ToggleSwitch $isActive={isAdding}>
                <S.ToggleSlider $isActive={isAdding} />
              </S.ToggleSwitch>

              <S.ClusterTitleInput
                value={newClusterTitle}
                placeholder="새 주제 이름"
                onChange={(e) => setNewClusterTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateCluster();
                  if (e.key === 'Escape') {
                    setNewClusterTitle('');
                    setIsAdding(false);
                  }
                }}
                autoFocus
              />
              <S.EditActionButtons>
                <S.SaveButton onClick={handleCreateCluster}>추가</S.SaveButton>
                <S.CancelButton onClick={() => { setNewClusterTitle(''); setIsAdding(false); }}>취소</S.CancelButton>
              </S.EditActionButtons>
            </div>
          )}
        </div>
      )}
      {displayClusters.length === 0 && !clusterLoading ? (
        <S.EmptyText>등록된 주제가 없습니다.</S.EmptyText>
      ) : (
        displayClusters.map((cluster, index) => (
          <S.ClusterContainer key={cluster.id}>
            {isOrdering ? (
              <S.ClusterItem $isActive={false}>
                <S.ToggleSwitch $isActive={false}>
                  <S.ToggleSlider $isActive={false} />
                </S.ToggleSwitch>
                <S.ClusterTitle>{cluster.title}</S.ClusterTitle>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <S.OrderButton
                    onClick={() => handleMoveUp(index)}
                    disabled={index === 0}
                  >
                    ↑
                  </S.OrderButton>
                  <S.OrderButton
                    onClick={() => handleMoveDown(index)}
                    disabled={index === displayClusters.length - 1}
                  >
                    ↓
                  </S.OrderButton>
                </div>
              </S.ClusterItem>
            ) : (
              <ClusterItem
                cluster={cluster}
                isAdmin={isAdmin}
                themeId={themeId}
              />
            )}
          </S.ClusterContainer>
        ))
      )}
    </>
  );
}

export default ClusterSection;


