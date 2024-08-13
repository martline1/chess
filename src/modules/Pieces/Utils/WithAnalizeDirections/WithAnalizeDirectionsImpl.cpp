#pragma once

#include "WithAnalizeDirections.h"

#include "../RawPosition/RawPosition.h"
#include "../StateController/StateController.h"
#include "../../Kinds/King/King.h"
#include "../../Kinds/Rook/Rook.h"
#include "../../../Common/GameState/GameState.h"
#include "../../../Common/InstanceOf/InstanceOf.h"
#include "../../../GameController/GameController.h"

class WithAnalizeDirections::WithAnalizeDirectionsImpl {
    private:
        WithAnalizeDirections* father;
        GameController* gameController;

    public:
        WithAnalizeDirectionsImpl(WithAnalizeDirections* father):
            father(father)
        {}

        virtual ~WithAnalizeDirectionsImpl() = default;

        void setGameController(GameController* gameController) {
            this->gameController = gameController;
        }

        /**
         * Goes in one direction (in 2d) until it finds a piece, if
         * it's the same color, it stops, if it is an enemy piece,
         * it adds the position to the possible moves (To eat it!)
         * 
         * Special case: if castle is available and this piece
         * is a rook, it goes one more to select the king
         */
        vector<RawPosition> analizeDirections(StateController* stateController) {
            vector<RawPosition> possibleMoves = vector<RawPosition>();
            unique_ptr<GameState>& gameState = this->gameController->gameControllerImpl->getGameState();

            State* state = stateController->getState();

            for (int index = 1; index < 8; index++) {
                for (std::pair<string, StateContent> entry: *state) {
                    string _ = entry.first;
                    StateContent* stateContent = &entry.second;

                    if (!stateContent->shouldContinue) continue;

                    RawPosition nextPosition = stateContent->getPosition(index);

                    GetValidPieceResponse response = gameState->gameStateImpl->getValidPiece(
                        nextPosition.getColumn(),
                        nextPosition.getRow()
                    );

                    if (response.isOutOfScope) {
                        stateContent->shouldContinue = false;

                        continue;
                    }

                    // If we found a piece
                    if (response.piece != nullptr) {
                        // Handle castle (Rook's perspective)
                        if (stateContent->enableCastle) {
                            GetValidPieceResponse kingResponse = gameState->gameStateImpl->getValidPiece(
                                4,
                                this->father->getCorrespondingRow()
                            );

                            bool canCastle =
                                !kingResponse.isOutOfScope
                                && InstanceOf::check<King>(kingResponse.piece)
                                && !static_cast<King*>(kingResponse.piece)->getHasMoved()
                                && InstanceOf::check<Rook>(this)
                                && !this->father->getHasMoved()
                                && !this->father->isTreatened()
                                && !static_cast<King*>(kingResponse.piece)->isTreatened();
                            
                            if (canCastle) {
                                possibleMoves.push_back(nextPosition);
                                stateContent->shouldContinue = false;

                                continue;
                            }
                        }

                        stateContent->shouldContinue = false;

                        // Handle regular piece
                        if (response.piece->pieceImpl->getColor() != this->father->pieceImpl->getColor()) {
                            std::cout << "added piece to eat!" << std::endl;
                            possibleMoves.push_back(nextPosition);
                        }

                        continue;
                    }

                    possibleMoves.push_back(nextPosition);
                }
            }

            return possibleMoves;
        }
};


WithAnalizeDirections::WithAnalizeDirections(PieceParams* params):
    CastlePiece(params),
    withAnalizeDirectionsImpl(make_unique<WithAnalizeDirectionsImpl>(this))
{}
