module ApplicationHelpers
  def responsive_image(path, fm: "avif", fit: nil, w: nil, h: nil, position: nil, q: 50)
    return nil unless path.present?
    path = path.data.cover_image || "default_cover_image.png" if path.is_a? Middleman::Blog::BlogArticle
    
    if development?      
      image_path(path)
    else
      # Production: serve via Netlify Image CDN
      image = image_path(path)      
      return image unless image.start_with?("/") or image.start_with?(config[:root_url])

      query_params = {
        fm: fm,
        fit: fit,
        w: w,
        h: h,
        position: position,
        q: q,
        url: image
      }.compact

      "/.netlify/images?#{query_params.to_query}"
    end
  end

  def responsive_image_srcset(path, mobile_w:, desktop_w:, h: nil, fm: "avif", fit: nil, position: nil, q: 50, sizes: nil)
    return { src: nil, srcset: nil } unless path.present?
    
    # Get base path
    base_path = path.is_a?(Middleman::Blog::BlogArticle) ? (path.data.cover_image || "default_cover_image.png") : path
    
    if development?
      # In development, return the simple image path without srcset
      { src: image_path(base_path), srcset: nil, sizes: nil }
    else
      # Generate mobile and desktop versions
      mobile_src = responsive_image(base_path, fm: fm, fit: fit, w: mobile_w, h: h, position: position, q: q)
      desktop_src = responsive_image(base_path, fm: fm, fit: fit, w: desktop_w, h: h, position: position, q: q)
      
      # Generate srcset string
      srcset = "#{mobile_src} #{mobile_w}w, #{desktop_src} #{desktop_w}w"
      
      # Use provided sizes or generate default
      calculated_sizes = sizes || "(max-width: 767px) #{mobile_w}px, #{desktop_w}px"
      
      {
        src: desktop_src,  # Fallback src
        srcset: srcset,
        sizes: calculated_sizes
      }
    end
  end

  def responsive_image_tag(path, mobile_w:, desktop_w:, h: nil, alt: "", css_class: nil, loading: "lazy", fm: "avif", fit: nil, position: nil, q: 50, sizes: nil, **extra_attrs)
    return "" unless path.present?
    
    # Get image data
    img_data = responsive_image_srcset(path, mobile_w: mobile_w, desktop_w: desktop_w, h: h, fm: fm, fit: fit, position: position, q: q, sizes: sizes)
    
    return "" unless img_data[:src]
    
    # Build attributes hash
    attrs = {
      alt: alt,
      loading: loading
    }
    
    # Add srcset and sizes if available (production)
    attrs[:srcset] = img_data[:srcset] if img_data[:srcset]
    attrs[:sizes] = img_data[:sizes] if img_data[:sizes]
    
    # Add class if provided
    attrs[:class] = css_class if css_class
    
    # Merge any extra attributes
    attrs.merge!(extra_attrs)
        
    image_tag(img_data[:src], **attrs)
  end

  def breadcrumbs
    breadcrumb_items = []
    
    # Home
    breadcrumb_items << {
      name: "Home",
      url: "/"
    }
    
    # Current page breadcrumbs
    if current_page.url != "/"
      path_parts = current_page.url.split("/").reject(&:empty?)
      
      path_parts.each_with_index do |part, index|
        url = "/" + path_parts[0..index].join("/") + "/"
        name = part.humanize
        
        # Customize names for specific sections
        case part
        when "destinations"
          name = "Destinations"
        when "packages"
          name = "Packages"
        when "articles"
          name = "Articles"
        when "about"
          name = "About"
        when "contact"
          name = "Contact"
        when "domestic"
          name = "Domestic Destinations"
        when "international"
          name = "International Destinations"
        end
        
        breadcrumb_items << {
          name: name,
          url: url
        }
      end
    end
    
    breadcrumb_items
  end

  def generate_breadcrumb_schema
    return unless breadcrumbs.length > 1
    
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map.with_index do |item, index|
        {
          "@type": "ListItem",
          "position": index + 1,
          "name": item[:name],
          "item": config[:root_url] + item[:url]
        }
      end
    }.to_json
  end

  # Dynamic SEO helpers
  def generate_destination_seo(destination)
    {
      title: "#{destination.name} Travel Packages | #{destination.name} Tours | FlyMaza",
      description: "Discover #{destination.name} with FlyMaza. #{destination.description} Book #{destination.name} travel packages, tours, and experiences. Best prices, expert guides, and unforgettable memories await!",
      keywords: "#{destination.name} travel, #{destination.name} packages, #{destination.name} tours, #{destination.name} holiday, travel to #{destination.name}, #{destination.name} vacation, #{destination.name} tourism",
      og_type: "website",
      og_image: responsive_image(destination.hero)
    }
  end

  def generate_package_seo(package, destination_name = nil)
    location = destination_name ? " in #{destination_name}" : ""
    {
      title: "#{package.title} | #{destination_name} Travel Package | FlyMaza",
      description: "#{package.description} Book #{package.title}#{location} with FlyMaza. Duration: #{package.duration}, Price: #{package.price}. Expert travel planning, best prices, and unforgettable experiences!",
      keywords: "#{package.title}, #{destination_name} package, #{destination_name} tour, #{package.title} price, #{destination_name} travel, #{destination_name} holiday, travel package #{destination_name}",
      og_type: "website",
      og_image: responsive_image(package.image)
    }
  end

  def generate_blog_seo(article)
    {
      title: "#{article.title} | Travel Blog | FlyMaza",
      description: "#{article.data.description || article.summary} Read more travel insights, tips, and stories on FlyMaza's travel blog. Expert travel advice and destination guides.",
      keywords: "#{article.tags.join(', ')}, travel blog, travel tips, travel stories, #{article.title.downcase}, travel advice, destination guide",
      og_type: "article",
      og_image: responsive_image(article)
    }
  end

  def generate_tag_seo(tag)
    {
      title: "#{tag.humanize} Travel Articles | Travel Blog | FlyMaza",
      description: "Explore #{tag.humanize} travel articles, tips, and stories on FlyMaza's travel blog. Discover expert travel advice, destination guides, and travel insights.",
      keywords: "#{tag}, travel articles, travel blog, travel tips, #{tag} travel, travel stories, travel advice, destination guide",
      og_type: "website",
      og_image: "/images/hero.jpg"
    }
  end

  def generate_articles_seo
    {
      title: "Travel Blog | Travel Tips, Stories & Destination Guides | FlyMaza",
      description: "Read FlyMaza's travel blog for expert travel tips, destination guides, travel stories, and insights. Discover the best travel advice for your next adventure.",
      keywords: "travel blog, travel tips, travel stories, destination guides, travel advice, travel insights, travel experiences, travel planning",
      og_type: "website",
      og_image: "/images/hero.jpg"
    }
  end

  def generate_packages_seo
    {
      title: "Travel Packages | Domestic & International Tours | FlyMaza",
      description: "Explore FlyMaza's curated travel packages for domestic and international destinations. Best prices, expert planning, and unforgettable travel experiences.",
      keywords: "travel packages, domestic tours, international tours, holiday packages, travel deals, vacation packages, tour packages, travel booking",
      og_type: "website",
      og_image: "/images/hero.jpg"
    }
  end

  def generate_destinations_seo
    {
      title: "Travel Destinations | Domestic & International Tours | FlyMaza",
      description: "Discover amazing travel destinations with FlyMaza. From domestic gems like Himachal Pradesh and Goa to international destinations like Bali and Thailand.",
      keywords: "travel destinations, domestic destinations, international destinations, India travel, Bali tours, Thailand packages, Himachal Pradesh, Goa, Kerala",
      og_type: "website",
      og_image: "/images/hero.jpg"
    }
  end

  def generate_contact_seo
    {
      title: "Contact FlyMaza | Travel Booking & Support | India Travel Agency",
      description: "Contact FlyMaza for travel booking, support, and custom travel planning. Get in touch with our travel experts for domestic and international packages. Call +91 96505 12067.",
      keywords: "contact FlyMaza, travel booking, travel support, travel inquiry, travel consultation, travel agency contact, travel booking India, travel planning",
      og_type: "website",
      og_image: "/images/hero.jpg"
    }
  end

  def generate_about_seo
    {
      title: "About FlyMaza | Travel Agency India | Our Story & Mission",
      description: "Learn about FlyMaza, India's trusted travel agency. Discover our story, mission, and commitment to creating unforgettable travel experiences across India and beyond.",
      keywords: "about FlyMaza, travel agency India, travel company, travel mission, travel team, Globe India Travels, travel experience, trusted travel partner",
      og_type: "website",
      og_image: "/images/certificate.jpg"
    }
  end

  def generate_home_seo
    {
      title: "FlyMaza - Your Journey, Our Expertise | Travel Agency India",
      description: "Discover India's extraordinary natural beauty and rich cultural heritage with FlyMaza. Expert travel experiences, curated packages, and unforgettable adventures await. Book your dream vacation today!",
      keywords: "travel agency India, domestic travel packages, international tours, holiday packages, adventure travel, cultural tours, FlyMaza, travel booking, vacation planning",
      og_type: "website",
      og_image: "/images/hero.jpg"
    }
  end

  def get_page_seo_data
    case current_page.url
    when "/"
      generate_home_seo
    when "/destinations/"
      generate_destinations_seo
    when "/packages/"
      generate_packages_seo
    when "/articles/"
      generate_articles_seo
    when "/about/"
      generate_about_seo
    when "/contact/"
      generate_contact_seo
    else
      # Check if it's a destination page
      if current_page.url.include?("/destinations/") && !current_page.url.include?("/packages/")
        destination = find_destination_by_url(current_page.url)
        destination ? generate_destination_seo(destination) : generate_home_seo
      # Check if it's a package page
      elsif current_page.url.include?("/packages/")
        package, destination = find_package_by_url(current_page.url)
        package ? generate_package_seo(package, destination&.name) : generate_home_seo
      # Check if it's a blog article
      elsif current_page.url.include?("/articles/") && current_article
        generate_blog_seo(current_article)
      # Check if it's a tag page
      elsif current_page.url.include?("/articles/tags/")
        tag = current_page.url.split("/").last
        generate_tag_seo(tag)
      else
        generate_home_seo
      end
    end
  end

  def find_destination_by_url(url)
    data.travel.destinations.values.flatten.find do |dest|
      dest.url == url
    end
  end

  def find_package_by_url(url)
    data.travel.destinations.values.flatten.each do |dest|
      package = dest.packages.find { |pkg| pkg.url == url }
      return [package, dest] if package
    end
    [nil, nil]
  end

  # XML escaping helper for sitemap and other XML content
  def xml_escape(text)
    return "" if text.nil?
    doc = Nokogiri::XML::Document.new
    Nokogiri::XML::Text.new(text.to_s, doc).to_xml
  end

  # JSON escaping helper for structured data
  def json_escape(text)
    return "" if text.nil?
    text.to_s.gsub('"', '\\"').gsub("\n", '\\n').gsub("\r", '\\r')
  end
end
