# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes

activate :external_pipeline,
  name: :css,
  command: "npx postcss source/stylesheets/tailwind.css -o .tmp/stylesheets/tailwind.css#{" --watch" unless build?}",
  source: ".tmp"
  
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings

# configure :build do
#   activate :minify_css
#   activate :minify_javascript, compressor: Terser.new
# end
set :port, 3000
set :trailing_slash, false

configure :build do
  activate :asset_hash do |opts|
    opts.exts = config[:asset_extensions] + %w(.avif .json) - %w(.ico)
  end
end

Time.zone = 'Asia/Kolkata'

activate :directory_indexes
set :markdown,
    input:  "GFM",        # use GitHub‑Flavored Markdown parser
    hard_wrap: false       # treat single newlines as <br/>

set :root_url, ENV['URL'] || 'http://localhost:4567'

configure :development do
  module Rack
    class DowncaseHeaders
      def initialize(app)
        @app = app
      end

      def call(env)
        status, headers, body = @app.call(env)
        # Lower-case all header names
        [status, headers.transform_keys(&:downcase), body]
      end
    end
  end
  use Rack::DowncaseHeaders
end


