class Api::V1::ImagesController < ApplicationController

  def index
    images = Image.all
    render json: images
  end

    def show
        images = Image.all.limit(30).where("difficulty <= (#{params[:id].to_i}*2000)")
        render json: images
    end


  def create
    image = Image.new(image_params)
    if image.valid?
      image.save
      render json: image
    else
      render text: "You suck."
    end


  end

  private

  def image_params
    params.require(:image).permit(:url, :tag)
  end

end
