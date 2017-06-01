class Api::V1::ImagesController < ApplicationController

  def index
    images = Image.all
    render json: images
  end

    def show
        images = Image.all
        num = rand(images.length).floor+1
        image = Image.find(num)
        render json: image
    end


  def create
      params[:array].each do |x|
          Image.create(url: params[:array][x].keys()[0], tag: params[:array][x].values()[0] )
      end

  end

  private

  def image_params
    params.require(:image).permit(:url, :tag)
  end

end
