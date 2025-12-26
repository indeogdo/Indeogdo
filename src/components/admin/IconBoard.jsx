'use client';

import * as S from '@/styles/admin/iconBoard.style';
import useIcon from '@/hooks/useIcon';
import AddButton from '@/components/admin/AddButton';
import Modal from '@/components/common/Modal';
import { useState, useRef } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';

function IconBoard() {
  const { icons, loading, error, deleteIcon, createIcon } = useIcon();
  const { uploadImageToServer } = useImageUpload({ bucket: 'icon' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [imgActiveFile, setImgActiveFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const [imgActivePreview, setImgActivePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imgInputRef = useRef(null);
  const imgActiveInputRef = useRef(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 이 아이콘을 삭제하시겠습니까?')) {
      try {
        await deleteIcon(id);
        // 성공 시 명시적으로 에러 초기화는 필요 없음 (hook에서 처리됨)
      } catch (err) {
        // 강제 삭제 가능한 경우 추가 확인
        if (err.canForceDelete) {
          const errorMsg = err.message || '알 수 없는 오류';
          const details = err.details || err.originalResult?.details || '';
          // details가 errorMsg와 다를 때만 추가 (중복 방지)
          const fullMessage = details && !errorMsg.includes(details)
            ? `${errorMsg}\n\n${details}`
            : errorMsg;

          if (window.confirm(`${fullMessage}\n\n그럼에도 이 아이콘을 삭제하시겠습니까?\n(관련 장소 컨텐츠의 아이콘이 빈 곳으로 남게 됩니다)`)) {
            try {
              await deleteIcon(id, true); // force=true로 재시도
              // 성공 시 에러는 자동으로 초기화됨
            } catch (forceErr) {
              alert('아이콘 삭제에 실패했습니다: ' + (forceErr.message || '알 수 없는 오류'));
            }
          }
        } else {
          alert('아이콘 삭제에 실패했습니다: ' + (err.message || '알 수 없는 오류'));
        }
      }
    }
  };

  const handleAddIcon = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setImgFile(null);
    setImgActiveFile(null);
    setImgPreview(null);
    setImgActivePreview(null);
    if (imgInputRef.current) imgInputRef.current.value = '';
    if (imgActiveInputRef.current) imgActiveInputRef.current.value = '';
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImgActiveChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImgActiveFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgActivePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imgFile) {
      alert('아이콘 이미지(img)는 필수입니다.');
      return;
    }

    setUploading(true);

    try {
      // img 업로드
      const imgResult = await uploadImageToServer(imgFile);
      if (!imgResult.success || !imgResult.file?.url) {
        alert(imgResult.error || '이미지 업로드에 실패했습니다.');
        setUploading(false);
        return;
      }

      // img_active 업로드 (있는 경우)
      let imgActiveUrl = null;
      if (imgActiveFile) {
        const imgActiveResult = await uploadImageToServer(imgActiveFile);
        if (imgActiveResult.success && imgActiveResult.file?.url) {
          imgActiveUrl = imgActiveResult.file.url;
        }
      }

      // 아이콘 생성
      await createIcon(imgResult.file.url, imgActiveUrl);

      // 성공 후 모달 닫기 및 초기화
      handleCloseModal();
      alert('아이콘이 추가되었습니다.');
    } catch (err) {
      console.error('아이콘 추가 오류:', err);
      alert('아이콘 추가에 실패했습니다: ' + (err.message || '알 수 없는 오류'));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <S.IconBoardWrapper>
        <S.IconHeader>
          <S.IconTitle>아이콘 관리</S.IconTitle>
          <S.IconToggle onClick={handleToggle}>
            {isExpanded ? '▲' : '▼'}
          </S.IconToggle>
        </S.IconHeader>
        <AddButton onClick={handleAddIcon}>
          <span>+</span>
          <span>새 아이콘 추가</span>
        </AddButton>
        <S.IconList $isExpanded={isExpanded}>
          {loading ? (
            <li>로딩 중...</li>
          ) : error ? (
            <li>오류</li>
          ) : icons.length === 0 ? (
            <li>아이콘이 없습니다</li>
          ) : (
            icons.map((icon) => (
              <S.IconItem key={icon.id}>
                <S.IconThumb src={icon.img} alt={`icon-${icon.id}`} />
                <S.IconThumb src={icon.img_active} alt={`icon-${icon.id}`} />
                <S.DeleteButton onClick={() => handleDelete(icon.id)}>
                  ×
                </S.DeleteButton>
              </S.IconItem>
            ))
          )}
        </S.IconList>
      </S.IconBoardWrapper>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="아이콘 추가">

        <form onSubmit={handleSubmit} >
          <S.FormGroup>
            <S.Label>
              아이콘 이미지 (필수) <span style={{ color: 'red' }}>*</span>
            </S.Label>
            <S.FileInput
              ref={imgInputRef}
              type="file"
              accept="image/*"
              onChange={handleImgChange}
              required
            />
            {imgPreview && (
              <S.ImagePreview src={imgPreview} alt="아이콘 미리보기" />
            )}
          </S.FormGroup>
          <S.FormGroup>
            <S.Label>아이콘 이미지 (활성화) - 선택사항</S.Label>
            <S.FileInput
              ref={imgActiveInputRef}
              type="file"
              accept="image/*"
              onChange={handleImgActiveChange}
            />
            {imgActivePreview && (
              <S.ImagePreview
                src={imgActivePreview}
                alt="활성화 아이콘 미리보기"
              />
            )}
          </S.FormGroup>
          <S.ButtonGroup>
            <S.CancelButton type="button" onClick={handleCloseModal}>
              취소
            </S.CancelButton>
            <S.SubmitButton type="submit" disabled={uploading}>
              {uploading ? '업로드 중...' : '추가'}
            </S.SubmitButton>
          </S.ButtonGroup>
        </form>
      </Modal>
    </>
  );
}

export default IconBoard;