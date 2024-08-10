#pragma once

#include <map>
#include <functional>

#include "../Kind/Kind.h"
#include "../PieceColor/PieceColor.h"

using std::map;
using std::function;

typedef map<Kind, function<void(int, int)>> PiecesInnerDict;
typedef map<PieceColor, PiecesInnerDict> PiecesDict;
