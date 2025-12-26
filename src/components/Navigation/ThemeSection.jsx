'use client';

import { useState, useEffect } from 'react';
import * as S from '@/styles/Navigation/navigation.style';
import ClusterSection from '@/components/Navigation/ClusterSection';
import EditButton from '@/components/admin/EditButton';
import useTheme from '@/hooks/useTheme';
import useMobile from '@/hooks/useMobile';

function ThemeSection({
  theme,
  isAdmin,
}) {
  const { updateTheme, deleteTheme } = useTheme();
  const isMobile = useMobile();
  const [isExpanded, setIsExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return true;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const handleToggleTheme = (e) => {
    if (!isEditing) {
      setIsExpanded(prev => !prev);
    }
  };

  const handleStartEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditingTitle(theme.title);
  };

  const handleSaveEdit = async (e) => {
    e?.stopPropagation();
    if (!editingTitle.trim()) return;
    try {
      const result = await updateTheme(theme.id, editingTitle.trim());
      if (result) {
        setIsEditing(false);
        setEditingTitle('');
        alert(`"${theme.title}" 테마 이름이 수정되었습니다.`);
      } else {
        alert(`"${theme.title}" 테마 이름 수정에 실패했습니다.`);
      }
    } catch (err) {
      console.error('Update theme error:', err);
      alert(`"${theme.title}" 테마 이름 수정 중 오류가 발생했습니다.`);
    }
  };

  const handleCancelEdit = (e) => {
    e?.stopPropagation();
    setIsEditing(false);
    setEditingTitle('');
  };

  const handleDelete = async (e) => {
    e?.stopPropagation();
    if (!confirm(`"${theme.title}" 테마를 삭제하시겠습니까?\n\n**주의**\n아래에 포함된 클러스터와 장소들도 함께 삭제됩니다.\n\n이 작업은 되돌릴 수 없습니다.`)) return;
    try {
      const result = await deleteTheme(theme.id);
      if (result) {
        alert(`"${theme.title}" 테마가 삭제되었습니다.`);
      }
    } catch (err) {
      console.error('Delete theme error:', err);
      const errorMsg = err.message || `"${theme.title}" 테마 삭제에 실패했습니다.`;
      const details = err.details || '';
      const fullMessage = details ? `${errorMsg}\n\n${details}` : errorMsg;
      alert(fullMessage);
    }
  };

  const handleOrder = (e) => {
    e?.stopPropagation();
    setIsOrdering(prev => !prev);
  };

  return (
    <S.ThemeItem>
      <S.ThemeHeader
        onClick={handleToggleTheme}
        $isExpanded={isExpanded}
      >
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
          <S.ThemeTitle>{theme.title}</S.ThemeTitle>
        )}
        {isAdmin && (
          isEditing ? (
            <S.EditActionButtons>
              <S.SaveButton onClick={handleSaveEdit}>저장</S.SaveButton>
              <S.CancelButton onClick={handleCancelEdit}>취소</S.CancelButton>
            </S.EditActionButtons>
          ) : (
            <EditButton onEdit={handleStartEdit} onDelete={handleDelete} onOrder={handleOrder} text="주제" />
          )
        )}
        <S.ExpandIcon $isExpanded={isExpanded}>
          {isExpanded ? '▲' : '▼'}
        </S.ExpandIcon>
      </S.ThemeHeader>

      <S.ClusterList $isVisible={isExpanded}>
        <ClusterSection
          themeId={theme.id}
          isAdmin={isAdmin}
          isOrdering={isOrdering}
          onOrderChange={() => setIsOrdering(false)}
        />
      </S.ClusterList>
    </S.ThemeItem>
  );
}

export default ThemeSection;


