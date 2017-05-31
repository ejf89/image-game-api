class Api::V1::DurationsController < ApplicationController


  def index
    @durations = Duration.all
    render json: @durations
  end

  def create
    # after lunch: need to test for whether duration is being created
    params[:timeArray].each do |k, val|

      @duration = Duration.create(image_id: val.keys[0].to_i, duration: val.values[0].to_i)

    end

    render json: @duration
  end

  def show
    @duration = Duration.find(params[:id])
    render json: @duration
  end

  private

  def duration_params(*args)
    params.require(:duration).permit(*args)
  end



end
