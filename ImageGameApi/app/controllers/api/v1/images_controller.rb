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
