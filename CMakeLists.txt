cmake_minimum_required(VERSION "3.19.2")

project(SDL_Chess)

# Define the c++ std version
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Include all .h and .cpp files
file(GLOB INPUTS "src/*.h")
file(GLOB SOURCES "src/*.cpp")
include_directories(${INPUTS})
add_executable(SDL_Chess ${SOURCES})

# Link SDL
find_package(SDL2 REQUIRED COMPONENTS SDL2)
find_package(SDL2_image REQUIRED)
target_link_libraries(SDL_Chess PUBLIC SDL2::SDL2)
target_link_libraries(SDL_Chess PRIVATE SDL2_image::SDL2_image)

# Copy resources to output
add_custom_command(
    TARGET SDL_Chess PRE_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy_directory
    ${CMAKE_SOURCE_DIR}/src/resources/ $<TARGET_FILE_DIR:SDL_Chess>
)

