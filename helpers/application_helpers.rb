module ApplicationHelpers
  def responsive_image(path, **options)
    # In development: return normal path
    # In production: will use Netlify image CDN with AVIF format
    if build?
      # Production logic for Netlify CDN will be added here
      image_tag(path, **options)
    else
      # Development logic
      image_tag(path, **options)
    end
  end
end
