'use client';

import * as S from '@/styles/admin/creditBoard.style';
import { useState, useEffect } from 'react';
import useCredits from '@/hooks/useCredits';
import AddButton from '@/components/admin/AddButton';
import Modal from '@/components/common/Modal';
import EditButton from '@/components/admin/EditButton';

function CreditBoard() {
  const { credits, loading, error, createCredit, updateCredit, deleteCredit, fetchCredits } = useCredits();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [role, setRole] = useState('');
  const [people, setPeople] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingRole, setEditingRole] = useState('');
  const [editingPeople, setEditingPeople] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  const [localCredits, setLocalCredits] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleAddCredit = () => {
    setIsModalOpen(true);
  };

  const handleDelete = async (creditId) => {
    if (window.confirm('정말 이 크래딧을 삭제하시겠습니까?')) {
      try {
        const result = await deleteCredit(creditId);
        if (result === null) {
          alert('크래딧 삭제에 실패했습니다: ' + (error || '알 수 없는 오류'));
        }
      } catch (err) {
        console.error('크래딧 삭제 오류:', err);
        alert('크래딧 삭제에 실패했습니다: ' + (err.message || '알 수 없는 오류'));
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRole('');
    setPeople('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await createCredit({ role, people });

      if (result === null) {
        // useCredits에서 에러 발생 시 null 반환
        alert('크래딧 추가에 실패했습니다: ' + (error || '알 수 없는 오류'));
        return;
      }

      // 성공 후 모달 닫기 및 초기화
      handleCloseModal();
      alert('크래딧이 추가되었습니다.');
    } catch (err) {
      console.error('크래딧 추가 오류:', err);
      alert('크래딧 추가에 실패했습니다: ' + (err.message || '알 수 없는 오류'));
    }
  };

  const handleStartEdit = (credit) => {
    setEditingId(credit.id);
    setEditingRole(credit.role || '');
    setEditingPeople(credit.people || '');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingRole('');
    setEditingPeople('');
  };

  const handleSaveEdit = async (creditId) => {
    if (!editingRole.trim() || !editingPeople.trim()) {
      alert('역할과 목록을 모두 입력해주세요.');
      return;
    }

    try {
      const result = await updateCredit(creditId, {
        role: editingRole.trim(),
        people: editingPeople.trim()
      });

      if (result === null) {
        alert('크래딧 수정에 실패했습니다: ' + (error || '알 수 없는 오류'));
        return;
      }

      handleCancelEdit();
      alert('크래딧이 수정되었습니다.');
    } catch (err) {
      console.error('크래딧 수정 오류:', err);
      alert('크래딧 수정에 실패했습니다: ' + (err.message || '알 수 없는 오류'));
    }
  };

  // 순서 변경 모드일 때 로컬 상태로 credits 관리
  useEffect(() => {
    if (isOrdering) {
      setLocalCredits([...credits]);
    }
  }, [isOrdering, credits]);

  // 기본적으로는 credits 사용, 순서 변경 모드일 때는 localCredits 사용
  const displayCredits = isOrdering ? localCredits : credits;

  const handleOrder = (e) => {
    e?.stopPropagation();
    setIsOrdering(prev => !prev);
    setIsExpanded(true);
  };

  const handleMoveUp = (index) => {
    if (index === 0) return;
    setLocalCredits(prev => {
      const newCredits = [...prev];
      [newCredits[index - 1], newCredits[index]] = [newCredits[index], newCredits[index - 1]];
      return newCredits;
    });
  };

  const handleMoveDown = (index) => {
    if (index === localCredits.length - 1) return;
    setLocalCredits(prev => {
      const newCredits = [...prev];
      [newCredits[index], newCredits[index + 1]] = [newCredits[index + 1], newCredits[index]];
      return newCredits;
    });
  };

  const handleSaveOrder = async () => {
    setIsSaving(true);
    try {
      // 모든 credit를 순서대로 업데이트 (1, 2, 3, 4...)
      // 기존 데이터는 유지하고 order만 업데이트
      const updatePromises = localCredits.map((credit, index) =>
        updateCredit(credit.id, {
          role: credit.role || '',
          people: credit.people || '',
          order: index + 1
        })
      );

      await Promise.all(updatePromises);

      // 데이터 새로고침
      await fetchCredits();

      alert('순서가 저장되었습니다.');
      setIsOrdering(false);
    } catch (err) {
      console.error('Save order error:', err);
      alert('순서 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelOrder = () => {
    // 원래 순서로 복원
    setLocalCredits([...credits]);
    setIsOrdering(false);
  };

  return (
    <>
      <S.CreditBoardWrapper>
        <S.CreditHeader>
          <S.CreditTitle>크래딧 관리</S.CreditTitle>
          <S.CreditToggle onClick={handleToggle}>
            {isExpanded ? '▲' : '▼'}
          </S.CreditToggle>
          <div style={{ display: 'flex', marginLeft: 'auto', marginRight: '5px', alignItems: 'center' }}>
            <EditButton onOrder={handleOrder} themeOrder={true} text="크래딧" />
          </div>
        </S.CreditHeader>
        <AddButton onClick={handleAddCredit}>
          <span>+</span>
          <span>새 크래딧 추가</span>
        </AddButton>

        {isOrdering && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginRight: '2px' }}>
            <S.OrderSaveButton onClick={handleSaveOrder} disabled={isSaving}>
              {isSaving ? '저장 중...' : '순서 저장'}
            </S.OrderSaveButton>
            <S.OrderCancelButton onClick={handleCancelOrder} disabled={isSaving}>
              취소
            </S.OrderCancelButton>
          </div>
        )}
        <S.CreditList $isExpanded={isExpanded}>
          {loading ? (
            <li>로딩 중...</li>
          ) : error ? (
            <li>오류: {error}</li>
          ) : displayCredits.length === 0 ? (
            <li>크래딧이 없습니다</li>
          ) : (
            displayCredits.map((credit, index) => (
              <S.CreditItem key={credit.id}>
                {isOrdering ? (
                  <>
                    <S.CreditItemContent>
                      <span>{credit.role || '-'}</span>
                      <span>{credit.people || '-'}</span>
                    </S.CreditItemContent>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <S.OrderButton
                        onClick={() => handleMoveUp(index)}
                        disabled={index === 0}
                      >
                        ↑
                      </S.OrderButton>
                      <S.OrderButton
                        onClick={() => handleMoveDown(index)}
                        disabled={index === displayCredits.length - 1}
                      >
                        ↓
                      </S.OrderButton>
                    </div>
                  </>
                ) : editingId === credit.id ? (
                  <S.CreditEditForm>
                    <S.EditInputGroup>
                      <S.Input
                        type="text"
                        value={editingRole}
                        onChange={(e) => setEditingRole(e.target.value)}
                        placeholder="역할"
                      />
                      <S.Input
                        type="text"
                        value={editingPeople}
                        onChange={(e) => setEditingPeople(e.target.value)}
                        placeholder="목록"
                      />
                    </S.EditInputGroup>
                    <S.EditButtonGroup>
                      <S.SaveButton onClick={() => handleSaveEdit(credit.id)} disabled={loading}>
                        저장
                      </S.SaveButton>
                      <S.CancelEditButton onClick={handleCancelEdit} disabled={loading}>
                        취소
                      </S.CancelEditButton>
                    </S.EditButtonGroup>
                  </S.CreditEditForm>
                ) : (
                  <>
                    <S.CreditItemContent>
                      <span>{credit.role || '-'}</span>
                      <span>{credit.people || '-'}</span>
                    </S.CreditItemContent>
                    <EditButton
                      onEdit={(e) => {
                        e.stopPropagation();
                        handleStartEdit(credit);
                      }}
                      onDelete={(e) => {
                        e.stopPropagation();
                        handleDelete(credit.id);
                      }}
                      hidden={true}
                      text="크래딧"
                    />
                  </>
                )}
              </S.CreditItem>
            ))
          )}
        </S.CreditList>
      </S.CreditBoardWrapper>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="크래딧 추가">
        <form onSubmit={handleSubmit}>
          <S.FormGroup>
            <S.Label>역할 (필수)</S.Label>
            <S.Input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
          </S.FormGroup>
          <S.FormGroup>
            <S.Label>목록 (필수)</S.Label>
            <S.Input type="text" value={people} onChange={(e) => setPeople(e.target.value)} required />
          </S.FormGroup>
          <S.ButtonGroup>
            <S.CancelButton type="button" onClick={handleCloseModal}>취소</S.CancelButton>
            <S.SubmitButton type="submit" disabled={loading}>
              {loading ? '추가 중...' : '추가'}
            </S.SubmitButton>
          </S.ButtonGroup>
        </form>
      </Modal>
    </>
  );
}

export default CreditBoard;