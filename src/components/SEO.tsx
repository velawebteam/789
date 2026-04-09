import { useEffect } from 'react';
import { COURSES_LIST } from '../constants/courses';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  image?: string;
}

export default function SEO({ title, description, canonical, image }: SEOProps) {
  useEffect(() => {
    if (title) document.title = title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink && canonical) {
      canonicalLink.setAttribute('href', canonical);
    }

    if (image) {
      const ogImage = document.querySelector('meta[property="og:image"]');
      if (ogImage) ogImage.setAttribute('content', image);
      
      const twitterImage = document.querySelector('meta[property="twitter:image"]');
      if (twitterImage) twitterImage.setAttribute('content', image);
    }
  }, [title, description, canonical, image]);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Real Builder Construction Academy",
    "alternateName": "Real Builder Academy",
    "url": "https://realbuilder-academy.com/",
    "logo": "https://lh3.googleusercontent.com/d/1JcDlCqhCcECmb6aCnMHr_G_Qj-FeGBHn",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "WhatsApp",
      "contactType": "customer service",
      "areaServed": "PT",
      "availableLanguage": ["Portuguese", "English"]
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Avenida Mateus Teixeira Azevedo 55",
      "addressLocality": "Tavira",
      "addressRegion": "Algarve",
      "postalCode": "8800-379",
      "addressCountry": "PT"
    },
    "sameAs": [
      "https://www.facebook.com/realbuilder.academy",
      "https://www.instagram.com/realbuilder.academy"
    ]
  };

  const courseSchemas = COURSES_LIST.map(course => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.name,
    "description": `Professional certification course in ${course.name} at Real Builder Academy.`,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "Real Builder Construction Academy",
      "sameAs": "https://realbuilder-academy.com/"
    }
  }));

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(courseSchemas)}
      </script>
    </>
  );
}
