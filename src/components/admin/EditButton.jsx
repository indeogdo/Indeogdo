import * as S from '@/styles/admin/editButton.style';

function EditButton({ onEdit, onDelete, onOrder, hidden, themeOrder, text }) {
  const handleEdit = (e) => {
    if (onEdit) {
      onEdit(e);
    }
  };

  const handleDelete = (e) => {
    if (onDelete) {
      onDelete(e);
    }
  };

  const handleOrder = (e) => {
    if (onOrder) {
      onOrder(e);
    }
  };

  return (
    <S.EditButtonWrapper>
      <S.EditButton onClick={handleOrder} hidden={hidden}>{text} 순서 변경</S.EditButton> <span hidden={hidden || themeOrder}>|</span>
      <S.EditButton onClick={handleEdit} hidden={themeOrder} >수정</S.EditButton> <span hidden={themeOrder}>|</span>
      <S.EditButton onClick={handleDelete} hidden={themeOrder}>삭제</S.EditButton>
    </S.EditButtonWrapper>
  );
}

export default EditButton;