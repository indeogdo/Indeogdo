import { create } from 'zustand';
import { useEffect } from 'react';

const useClusterSitesStore = create((set, get) => ({
  // clusterId -> sites Map
  activeClustersSites: new Map(),

  // 클러스터의 sites 추가/업데이트
  setClusterSites: (clusterId, sites) => {
    set((state) => {
      const newMap = new Map(state.activeClustersSites);
      newMap.set(clusterId, sites);
      return { activeClustersSites: newMap };
    });
  },

  // 클러스터의 sites 제거
  removeClusterSites: (clusterId) => {
    set((state) => {
      const newMap = new Map(state.activeClustersSites);
      newMap.delete(clusterId);
      return { activeClustersSites: newMap };
    });
  },

  // 모든 활성화된 클러스터의 sites를 배열로 반환
  getAllActiveSites: () => {
    const { activeClustersSites } = get();
    const allSites = [];
    for (const sites of activeClustersSites.values()) {
      allSites.push(...sites);
    }
    return allSites;
  },

  // 모든 sites 초기화
  clearAllSites: () => {
    set({ activeClustersSites: new Map() });
  },
}));

// 지도에 sites를 전달하는 subscription hook
export const useSyncSitesToMap = () => {
  const activeClustersSites = useClusterSitesStore((state) => state.activeClustersSites);

  useEffect(() => {
    if (window.onSitesSelected) {
      const allSites = [];
      for (const sites of activeClustersSites.values()) {
        allSites.push(...sites);
      }
      window.onSitesSelected(allSites);
    }
  }, [activeClustersSites]);
};

export default useClusterSitesStore;

