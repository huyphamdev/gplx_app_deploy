app.factory("TestLogicService", ["$interval", "$timeout", function ($interval, $timeout) {
  return {
    startTimer: function ($scope, callback) {
      $scope.timerInterval = $interval(
        function () {
          if ($scope.is_submitted) return;
          $scope.countDown--;
          let minutes = Math.floor($scope.countDown / 60);
          let seconds = Math.floor($scope.countDown % 60);
          $scope.timer = `${minutes}:${seconds}`;
          if ($scope.countDown == 0) {
            $interval.cancel($scope.timerInterval);
            callback();
          }
        },
        1000,
        $scope.countDown,
      );
    },

    stopTimer: function ($scope) {
      if ($scope.timerInterval) $interval.cancel($scope.timerInterval);
    },

    calculateExamResult: function ($scope, questionArray, isRandomMode) {
      let saveAnses = questionArray.map(function (item) {
        let qIndex = isRandomMode ? item.index : item;
        return isExamAnsweredCorrect(
          $scope.licenseCode,
          $scope.examCode,
          qIndex,
        );
      });

      let dangerQuestions = $scope.questions.filter(function (question) {
        return isRequired(question, license.code);
      });
      let dangerCorrectAnses = dangerQuestions
        .map(function (question) {
          return isExamAnsweredCorrect(
            $scope.licenseCode,
            $scope.examCode,
            question.index,
          );
        })
        .filter(function (correct) {
          return correct == true;
        });

      let danger = dangerCorrectAnses.length;
      let passed = saveAnses.filter(function (ans) {
        return ans == true;
      }).length;
      let isPassed =
        passed >= license.pass && danger >= dangerQuestions.length ? 1 : 0;

      let hasAns = $scope.questions.filter(function (question) {
        return hasExamAnswered(
          $scope.licenseCode,
          $scope.examCode,
          question.index,
        );
      }).length;

      let unchecked = questionArray.length - hasAns;
      let failed = questionArray.length - (passed + unchecked);

      let duration = license.timer - $scope.countDown;
      let minutes = Math.floor(duration / 60);
      let seconds = Math.floor(duration % 60);
      let timer = `${minutes}:${seconds}`;

      $scope.result = {
        passed: passed,
        failed: failed,
        unchecked: unchecked,
        danger: danger,
        dangerTotal: dangerQuestions.length,
        time: timer,
      };
      $scope.result_passed = isPassed === 1;
      return isPassed;
    },

    autoNextQuestion: function (callback) {
      $timeout(function () {
        callback();
      }, 800);
    },
  };
}]);
