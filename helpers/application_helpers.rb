module ApplicationHelpers
  def responsive_image(path, fm: "avif", fit: nil, w: nil, h: nil, position: nil, q: 50)
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
end
