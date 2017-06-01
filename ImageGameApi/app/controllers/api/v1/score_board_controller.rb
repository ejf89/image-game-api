class Api::V1::ScoreBoardController < ApplicationController

    def index
        scores = ScoreBoard.all.limit(10).order(:score).reverse
        
        render json: scores
    end

    def create
        byebug
    end
    
end
