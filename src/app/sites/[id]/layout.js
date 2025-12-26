import { getSiteData } from '@/lib/siteData';

// 동적 메타데이터 생성 함수
export async function generateMetadata({ params }) {
  try {
    const { id } = await params;
    const { data, error } = await getSiteData(id);

    if (error || !data) {
      return {
        title: "인덕도 : 사이트 상세 페이지",
        description: "인덕도 : 사이트 상세 페이지",
      };
    }

    // 사이트 데이터로 메타데이터 구성
    const siteTitle = data.title || '사이트';
    const siteAddress = data.addresses && data.addresses.length > 0
      ? data.addresses.map(addr => addr.name).join(', ')
      : '';
    const clusterTitle = data.cluster?.title || '';
    const themeTitle = data.cluster?.theme?.title || '';

    // description: contents에서 첫 번째 paragraph를 찾아 사용, 없으면 기존 로직 사용
    const firstParagraph = data.contents?.find(item => item.type === 'paragraph')?.data?.text;
    const paragraphText = firstParagraph
      ? firstParagraph.replace(/<[^>]*>/g, '').trim() // HTML 태그 제거
      : null;
    const fallbackDescription = siteAddress
      ? `${themeTitle} : ${clusterTitle} - ${siteTitle} (${siteAddress})`
      : `${themeTitle} : ${clusterTitle} - ${siteTitle}`;
    const siteDescription = paragraphText || fallbackDescription;

    // 이미지 URL (icon이 있으면 사용, 없으면 contents에서 첫 번째 이미지, 그것도 없으면 기본 로고)
    const firstImageFromContents = data.contents?.find(item => item.type === 'image')?.data?.file?.url;
    const imageUrl = firstImageFromContents || data.icon?.img || '/screen01.png';

    const keywords = [
      siteTitle,
      siteAddress,
      clusterTitle,
      themeTitle,
      "인덕도",
      "인덕원",
      "디지털맵",
      "도시기록",
    ].filter(Boolean);

    return {
      title: `${siteTitle} : 인덕도`,
      description: siteDescription,
      keywords: keywords,

      // Open Graph
      openGraph: {
        title: `${siteTitle} : 인덕도`,
        description: siteDescription,
        siteName: "인덕도",
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: siteTitle,
          },
        ],
        locale: 'ko_KR',
        type: 'website',
      },

      // Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: `${siteTitle} : 인덕도`,
        description: siteDescription,
        images: [imageUrl],
      },

      alternates: {
        canonical: `/sites/${id}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // 에러 발생 시 기본 메타데이터 반환
    return {
      title: "인덕도 : 사이트 상세 페이지",
      description: "인덕도 : 사이트 상세 페이지",
    };
  }
}

export default function SitePageLayout({ children }) {
  return (
    <>
      {children}
    </>
  );
}
