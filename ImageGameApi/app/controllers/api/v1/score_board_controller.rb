class Api::V1::ScoreBoardController < ApplicationController

    def index
        scores = ScoreBoard.all.limit(10).order(score: :desc)

        render json: scores
    end

    def create
        ScoreBoard.create(initials: params.keys[0], score: params[params.keys[0]])
    end
    
end
