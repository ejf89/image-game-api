class Api::V1::ImagesController < ApplicationController

  def index
    images = Image.all
    render json: images
  end

    def show
        images = Image.all.where("difficulty <= (#{params[:id].to_i}*2000)").shuffle[0..9]

        render json: images
    end


  def create

      params[:array].each do |x|
          Image.create(url: params[:array][x].keys()[0], tag: params[:array][x].values()[0].downcase, difficulty: 1000 )
      end


  end

  private

  def image_params
    params.require(:image).permit(:url, :tag)
  end

end
