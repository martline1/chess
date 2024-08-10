#pragma once

#include "PiecesLoader.h"

#include "../Common/Kind/Kind.h"
#include "../Common/PiecesDict/PiecesDict.h"

#include "../App/App.h"
#include "../Pieces/Piece.h"
#include "../Common/Config/Config.h"
#include "../Pieces/Kinds/King/King.h"
#include "../Pieces/Kinds/Rook/Rook.h"
#include "../Pieces/Kinds/Pawn/Pawn.h"
#include "../Pieces/Kinds/Queen/Queen.h"
#include "../Pieces/Kinds/Bishop/Bishop.h"
#include "../Pieces/Kinds/Knight/Knight.h"

class PiecesLoader::PiecesLoaderImpl {
    private:
        App* app;
        Config* config;
        vector<Kind> kinds;
        unique_ptr<PiecesDict> pieces;
        GameController* gameController;
        vector<Piece<RawPosition>*> piecePtrs;

    public:
        PiecesLoaderImpl():
            pieces(make_unique<PiecesDict>()),
            piecePtrs(vector<Piece<RawPosition>*>())
        {
            this->kinds.push_back(Kind::KING);
            this->kinds.push_back(Kind::QUEEN);
            this->kinds.push_back(Kind::BISHOP);
            this->kinds.push_back(Kind::KNIGHT);
            this->kinds.push_back(Kind::ROOK);
            this->kinds.push_back(Kind::PAWN);

            this->pieces->insert({ PieceColor::WHITE, map<Kind, function<void(int, int)>>() });
            this->pieces->insert({ PieceColor::BLACK, map<Kind, function<void(int, int)>>() });
        }

        vector<Piece<RawPosition>*>* getPiecePtrs() {
            return &this->piecePtrs;
        }

        GameController* getGameController() {
            return this->gameController;
        }

        App* getApp() {
            return this->app;
        }

        unique_ptr<PiecesDict>& getPieces() {
            return this->pieces;
        }

        Config* getConfig() {
            return this->config;
        }

        vector<Kind>* getKinds() {
            return &this->kinds;
        }

        void setGameController(GameController* gameController) {
            this->gameController = gameController;
        }

        void setApp(App* app) {
            this->app = app;
        }

        void setConfig(Config* config) {
            this->config = config;
        }
};

PiecesLoader::PiecesLoader():
    image(nullptr),
    loadTextureCalled(false),
    piecesLoaderImpl(make_unique<PiecesLoaderImpl>())
{}

void PiecesLoader::loadPieces() {
    Config* config = this->piecesLoaderImpl->getConfig();
    unique_ptr<PiecesDict>& pieces = this->piecesLoaderImpl->getPieces();

    int squareX = std::floor(this->image->w / 6);
    int squareY = std::floor(this->image->h / 2);

    for (int isBlack = 0; isBlack < 2; isBlack++) {
        for (int i = 0; i < 6; i++) {
            int sourceX = squareX * i;
            int sourceY = squareY * isBlack;

            Kind& kind = this->piecesLoaderImpl->getKinds()->at(i);
            PieceColor color = isBlack ? PieceColor::BLACK : PieceColor::WHITE;

            pieces->at(color).insert({
                kind,
                [=, this](int column, int row) -> void {
                    PieceParams params = PieceParams();

                    params.color          = color;
                    params.kind           = kind;
                    params.row            = row;
                    params.column         = column;
                    params.app            = this->piecesLoaderImpl->getApp();
                    params.config         = this->piecesLoaderImpl->getConfig();
                    params.gameController = this->piecesLoaderImpl->getGameController();
                    params.renderTexture  = [=, this, &params](int destinationX, int destinationY) -> void {
                        SDL_Rect source = SDL_Rect();

                        source.x = sourceX;
                        source.y = sourceY;
                        source.w = squareX;
                        source.h = squareY;

                        SDL_Rect destination = SDL_Rect();

                        destination.x = destinationX;
                        destination.y = destinationY;
                        destination.w = this->piecesLoaderImpl->getConfig()->getSquareSize();
                        destination.h = this->piecesLoaderImpl->getConfig()->getSquareSize();

                        SDL_RenderCopy(
                            this->piecesLoaderImpl->getApp()->getRenderer(),
                            this->texture,
                            &source,
                            &destination
                        );
                    };

                    vector<Piece<RawPosition>*>* piecePtrs = this->piecesLoaderImpl->getPiecePtrs();

                    switch (kind) {
                        case Kind::KING: {
                            King* king = new King(&params);

                            piecePtrs->push_back(king);
                            break;
                        }
                        case Kind::QUEEN: {
                            Queen* queen = new Queen(&params);

                            piecePtrs->push_back(queen);
                            break;
                        }
                        case Kind::ROOK: {
                            Rook* rook = new Rook(&params);

                            piecePtrs->push_back(rook);
                            break;
                        }
                        case Kind::KNIGHT: {
                            Knight* knight = new Knight(&params);

                            piecePtrs->push_back(knight);
                            break;
                        }
                        case Kind::BISHOP: {
                            Bishop* bishop = new Bishop(&params);

                            piecePtrs->push_back(bishop);
                            break;
                        }
                        case Kind::PAWN: {
                            Pawn* pawn = new Pawn(&params);

                            piecePtrs->push_back(pawn);
                            break;
                        }
                    }
                }
            });
        }
    }
}

void PiecesLoader::loadTexture() {
    string path = SDL_GetBasePath();
    string piecesPath = path + "chess_pieces.png";

    this->image = IMG_Load(piecesPath.c_str());

    this->texture = SDL_CreateTextureFromSurface(
        this->piecesLoaderImpl->getApp()->getRenderer(),
        this->image
    );
}

PiecesLoader::~PiecesLoader() {
    SDL_DestroyTexture(this->texture);
    SDL_FreeSurface(this->image);
}

SDL_Surface* PiecesLoader::getImage() {
    return this->image;
}
