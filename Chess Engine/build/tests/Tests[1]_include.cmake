if(EXISTS "/home/harsh-kumar/Desktop/spe_final_project/VictorySquare/Chess Engine/build/tests/Tests[1]_tests.cmake")
  include("/home/harsh-kumar/Desktop/spe_final_project/VictorySquare/Chess Engine/build/tests/Tests[1]_tests.cmake")
else()
  add_test(Tests_NOT_BUILT Tests_NOT_BUILT)
endif()
