module ApplicationHelpers
  def responsive_image(path, fm: "avif", fit: nil, w: nil, h: nil, position: nil, q: 50)
    # Development: return normal asset path
    if development?
      image_path(path)
    else
      # Production: serve via Netlify Image CDN
      image = image_path(path)

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
