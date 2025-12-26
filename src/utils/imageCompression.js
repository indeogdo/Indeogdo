/**
 * 이미지 압축 유틸 함수
 * 1MB를 넘는 이미지를 압축하여 1MB 이하로 만들되, 포맷은 유지합니다.
 * GIF는 프레임 손실 방지를 위해 압축을 건너뜁니다.
 */

/**
 * GIF를 제외한 이미지를 WebP로 변환하며 압축합니다. (GIF는 스킵)
 * @param {File} file - 압축할 이미지 파일
 * @param {number} maxSizeInMB - 최대 파일 크기 (MB 단위, 기본값: 1)
 * @param {number} initialQuality - 압축 시작 품질 (0.1 ~ 1.0, 기본값: 0.9)
 * @returns {Promise<File>} 압축된 이미지 파일 또는 원본 파일
 */
export const compressImageKeepFormat = (file, maxSizeInMB = 1, initialQuality = 0.9) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type || !file.type.startsWith('image/')) return resolve(file);

    // GIF는 압축 스킵
    if (file.type === 'image/gif') return resolve(file);

    const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
    if (file.size <= maxSizeInBytes) return resolve(file);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = async () => {
      // 출력 포맷: WebP로 강제 변환 (GIF 제외)
      const outputType = 'image/webp';
      let quality = initialQuality;

      const minDimension = 640;
      let currentMaxDim = 1920;

      const drawScaled = () => {
        let w = img.width;
        let h = img.height;
        if (w > currentMaxDim || h > currentMaxDim) {
          if (w > h) {
            h = (h * currentMaxDim) / w;
            w = currentMaxDim;
          } else {
            w = (w * currentMaxDim) / h;
            h = currentMaxDim;
          }
        }
        canvas.width = Math.max(Math.round(w), 1);
        canvas.height = Math.max(Math.round(h), 1);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };

      const toBlobAsync = (type, q) => new Promise((res, rej) => {
        canvas.toBlob((blob) => {
          if (!blob) return rej(new Error('이미지 압축 실패'));
          res(blob);
        }, type, q);
      });

      // 반복: 품질 먼저 낮추고, 여전히 크면 해상도 점진적 축소 (WebP)
      while (true) {
        drawScaled();
        const blob = await toBlobAsync(outputType, quality);

        if (blob.size <= maxSizeInBytes) {
          // 확장자를 .webp로 교체
          const newName = file.name.replace(/\.[^/.]+$/, '.webp');
          const compressedFile = new File([blob], newName, { type: outputType, lastModified: Date.now() });
          return resolve(compressedFile);
        }

        if (quality > 0.4) {
          quality = Math.max(0.4, quality - 0.1);
          continue;
        }

        if (currentMaxDim > minDimension) {
          currentMaxDim = Math.max(minDimension, Math.floor(currentMaxDim * 0.85));
          quality = Math.min(0.9, quality + 0.05);
          continue;
        }

        // 더 줄일 수 없으면 원본 반환
        return resolve(file);
      }
    };

    img.onerror = () => reject(new Error('이미지 로드 실패'));
    const reader = new FileReader();
    reader.onload = (e) => (img.src = e.target.result);
    reader.onerror = () => reject(new Error('파일 읽기 실패'));
    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 파일의 크기를 확인하고 필요시 압축합니다. (webp 변환 없음, GIF 스킵)
 * @param {File} file - 확인할 이미지 파일
 * @param {number} maxSizeInMB - 최대 파일 크기 (MB 단위, 기본값: 1)
 * @returns {Promise<File>} 압축된 이미지 파일 또는 원본 파일
 */
export const checkAndCompressImage = async (file, maxSizeInMB = 1) => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

  if (!file || file.size <= maxSizeInBytes) {
    return file;
  }

  try {
    console.log(`이미지 압축 중... (원본: ${(file.size / 1024 / 1024).toFixed(2)}MB)`);
    const compressedFile = await compressImageKeepFormat(file, maxSizeInMB);
    console.log(`압축 완료: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
    return compressedFile;
  } catch (error) {
    console.error('이미지 압축 실패:', error);
    return file; // 압축 실패시 원본 반환
  }
};

/**
 * 이미지 파일의 정보를 로그로 출력합니다.
 * @param {File} file - 확인할 이미지 파일
 * @param {string} label - 로그 라벨
 */
export const logImageInfo = (file, label = '이미지') => {
  const sizeInMB = (file.size / 1024 / 1024).toFixed(2);
  console.log(`${label}: ${file.name} (${sizeInMB}MB, ${file.type})`);
};
