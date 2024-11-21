cmake_minimum_required(VERSION 3.14)

set(Headers
    ../engine/board.hpp
    ../engine/utils.hpp
)

set(Sources
    ../engine/board.cpp
    ../engine/utils.cpp
    tests.cpp
)

set(This Tests)

add_executable(${This} ${Sources})

target_link_libraries(${This}
    gtest_main   
)

include(GoogleTest)
gtest_discover_tests(${This})

# add_test(
#     NAME ${This}
#     COMMAND ${This}
# )