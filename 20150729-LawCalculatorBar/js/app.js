(function(){
	var myApp = angular.module('receiptApp', ['ui.router'])
					.config(function($stateProvider, $urlRouterProvider) {
					  //
					  // Любые неопределенные url перенаправлять на /state1
					  $urlRouterProvider.otherwise("/calc");
					  //
					  // Теперь определим состояния
					  $stateProvider
					    .state('calc', {
					      url: "/calc",
					      templateUrl: "js/templates/calc.html"
					    })
					    .state('kvit', {
					      url: "/kvit",
					      templateUrl: "js/templates/kvit.html"
					    })
					});

	myApp.service('sharedProperties', function(){
		var property = '';

		return {
			getProperty: function(){
				return property;
			},
			setPropery: function(val){
				property = val;
			}
		}
	});


	myApp.controller('CourtsOfLaw', function($scope, sharedProperties){
		var self = this;
		this.allCourts = courtsData;
		this.userInput = {
			date: new Date(),
			name: null,
			adress: null,
			summ: null
			};

		this.userInput.summ = sharedProperties.getProperty();

		$scope.printedCourt = {
			id: null,
			poluchatel: null,
			kpp: null,
			inn: null,
			okato: null,
			schet: null,
			ucherejdenie: null,
			kbk: null,
			adress: null
		};

		$scope.submit = function(){

			var loadFile=function(url,callback){
		        JSZipUtils.getBinaryContent(url,callback);
		    }
		    loadFile("js/kvitancia.docx",function(err,content){
		        if (err) { throw e};
		        doc=new Docxgen(content);
		        doc.setData( {'fio': self.userInput.name || '',
					'adress':self.userInput.adress || '',
					'date':self.userInput.date.getDate() + '.' + ('0' + (+self.userInput.date.getMonth() + 1)).slice(-2) + '.' + self.userInput.date.getFullYear() + ' г.',
					'summ':self.userInput.summ || '',
					'inn': $scope.printedCourt.inn || '',
					'kbk': $scope.printedCourt.kbk || '',
					'kpp': $scope.printedCourt.kpp || '',
					'okato': $scope.printedCourt.okato || '',
					'poluchatel': $scope.printedCourt.poluchatel || '',
					'schet': $scope.printedCourt.schet || '',
					'ucherejdenie': $scope.printedCourt.ucherejdenie || ''
					}
		        ) //set the templateVariables
		        doc.render() //apply them (replace all occurences of {first_name} by Hipp, ...)
		        out=doc.getZip().generate({type:"blob"}) //Output the document using Data-URI
		        saveAs(out,"output.docx")
		    });

		};
	});

	myApp.controller('Calculator', function($scope, sharedProperties){
		function extend(obj1, obj2){
		    for (key in obj2){
		      obj1[key]=obj2[key];
		    }
		    return obj1;
		}

		$scope.showOption = function(num){
			if ($scope.calcModel.id == 0){
				return true;
			}else if ($scope.calcModel.id == num){
				return true;
			}else{
				return false;
			};
		};

		$scope.selectOption = function(num, summ){
			if (summ) {
				$scope.calcModel.result = summ;
			};

			$scope.calcModel.id = num;
		};

		$scope.calcModel = {
			'id': 1,
			'pages': null,
			'summ': null,
			'result': 200
		};

		$scope.$watch('calcModel.pages', function(){
			if ($scope.calcModel.pages < 10) {
				$scope.calcModel.result = 40;
			} else {
				$scope.calcModel.result = $scope.calcModel.pages * 4;
			}

		});

		$scope.$watch('calcModel.summ', function(newValue, oldValue){
			$scope.calcModel.result = $scope.calcModel.summ * 0.04;
			if ($scope.calcModel.result < 400){
				$scope.calcModel.result = 400;
			} else if (20000 < $scope.calcModel.summ && $scope.calcModel.summ <= 100000){
				$scope.calcModel.result = 800 + ($scope.calcModel.summ - 20000) * 0.03;
			} else if (100000 < $scope.calcModel.summ && $scope.calcModel.summ <= 200000){
				$scope.calcModel.result = 3200 + ($scope.calcModel.summ - 100000) * 0.02;
			} else if (200000 < $scope.calcModel.summ && $scope.calcModel.summ <= 1000000){
				$scope.calcModel.result = 5200 + ($scope.calcModel.summ - 200000) * 0.01;
			} else if (1000000 < $scope.calcModel.summ){
				$scope.calcModel.result = 13200 + ($scope.calcModel.summ - 1000000) * 0.005;
			};
			if ($scope.calcModel.result > 60000){
				$scope.calcModel.result = 60000;
			};

			$scope.calcModel.result = Math.floor($scope.calcModel.result * 100) / 100;
		});

		$scope.$watch('calcModel.result', function(){
			sharedProperties.setPropery($scope.calcModel.result);
		});

		$scope.log = function(n){
			console.log(n);
		}

	});

	var courtsData = [
			{id: 3,
			poluchatel: 'УФК по г. Москве (ИФНС России № 16 по г.Москве )',
			kpp: '771601001',
			inn: '7716103458',
			okato: '45351000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Бабушкинский районный суд г. Москвы'
			},
			{id: 5,
			poluchatel: 'УФК по г. Москве (ИФНС России № 8 по г.Москве )',
			kpp: '770801001',
			inn: '7708034472',
			okato: '45378000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Басманный районный суд г. Москвы'
			},
			{id: 4,
			poluchatel: 'УФК по г. Москве (ИФНС России № 13 по г.Москве )',
			kpp: '771501001',
			inn: '7713034630',
			okato: '45346000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Бутырский районный суд г. Москвы'
			},
			{id: 2,
			poluchatel: 'УФК по г. Москве (ИФНС России № 6 по г.Москве )',
			kpp: '770601001',
			inn: '7706044740',
			okato: '45384000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Гагаринский районный суд г. Москвы'
			},
			{id: 1,
			poluchatel: 'УФК по г. Москве (ИФНС России № 43 по г.Москве )',
			kpp: '774301001',
			inn: '7743777777',
			okato: '45341000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Головинский районный суд г. Москвы'
			},
			{id: 6,
			poluchatel: 'УФК по г. Москве (ИФНС России № 30 по г.Москве )',
			kpp: '773001001',
			inn: '7730057570',
			okato: '45318000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Дорогомиловский районный суд г. Москвы'
			},
			{id: 7,
			poluchatel: 'УФК по г. Москве (ИФНС России № 5 по г.Москве )',
			kpp: '770501001',
			inn: '7705045236',
			okato: '45376000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Замоскворецкий районный суд г. Москвы'
			},
			{id: 8,
			poluchatel: 'УФК по г. Москве (ИФНС России № 35 по г.Москве )',
			kpp: '773501001',
			inn: '7735071603',
			okato: '45330000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Зеленоградский районный суд г. Москвы'
			},
			{id: 9,
			poluchatel: 'УФК по г. Москве (ИФНС России № 27 по г.Москве )',
			kpp: '772701001',
			inn: '7727092173',
			okato: '45397000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Зюзинский районный суд г. Москвы'
			},
			{id: 10,
			poluchatel: 'УФК по г. Москве (ИФНС России № 1 по г.Москве )',
			kpp: '770901001',
			inn: '7701107259',
			okato: '45375000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Измайловский районный суд г. Москвы'
			},
			{id: 11,
			poluchatel: 'УФК по г. Москве (ИФНС России № 43 по г.Москве )',
			kpp: '774301001',
			inn: '7743777777',
			okato: '45341000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Коптевский районный суд г. Москвы'
			},
			{id: 12,
			poluchatel: 'УФК по г. Москве (ИФНС России № 21 по г.Москве )',
			kpp: '772101001',
			inn: '7721049904',
			okato: '45394000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Кузьминский районный суд г. Москвы'
			},
			{id: 13,
			poluchatel: 'УФК по г. Москве (ИФНС России № 31 по г.Москве )',
			kpp: '773101001',
			inn: '7731154880',
			okato: '45320000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Кунцевский районный суд г. Москвы'
			},
			{id: 14,
			poluchatel: 'УФК по г. Москве (ИФНС России № 9 по г.Москве )',
			kpp: '772201001',
			inn: '7709000010',
			okato: '45381000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Лефортовский районный суд г. Москвы'
			},
			{id: 16,
			poluchatel: 'УФК по г. Москве (ИФНС России № 23 по г.Москве )',
			kpp: '772301001',
			inn: '7723013452',
			okato: '45389000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Люблинский районный суд г. Москвы'
			},
			{id: 15,
			poluchatel: 'УФК по г. Москве (ИФНС России № 8 по г.Москве )',
			kpp: '770801001',
			inn: '7708034472',
			okato: '45378000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Мещанский районный суд г. Москвы'
			},
			{id: 17,
			poluchatel: 'УФК по г. Москве (ИФНС России № 24 по г.Москве )',
			kpp: '772401001',
			inn: '7724111558',
			okato: '45918000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Нагатинский районный суд г. Москвы'
			},
			{id: 18,
			poluchatel: 'УФК по г. Москве (ИФНС России № 29 по г.Москве )',
			kpp: '772901001',
			inn: '7729150007',
			okato: '45325000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Никулинский районный суд г. Москвы'
			},
			{id: 19,
			poluchatel: 'УФК МФ по г. Москве (ИФНС России № 17 г. Москвы)',
			kpp: '771701001',
			inn: '7717018935',
			okato: '45358000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Останкинский районный суд г. Москвы'
			},
			{id: 20,
			poluchatel: 'УФК по г. Москве (ИФНС России № 20 по г.Москве )',
			kpp: '772001001',
			inn: '7720143220',
			okato: '45312000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Перовский районный суд г. Москвы'
			},
			{id: 21,
			poluchatel: 'УФК по г. Москве (ИФНС России № 18 по г.Москве )',
			kpp: '771801001',
			inn: '7718111790',
			okato: '45316000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Преображенский районный суд г. Москвы'
			},
			{id: 22,
			poluchatel: 'УФК по г. Москве (ИФНС России № 3 по г.Москве )',
			kpp: '770301001',
			inn: '7703037470',
			okato: '45380000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Пресненский районный суд г. Москвы'
			},
			{id: 23,
			poluchatel: 'УФК по г. Москве (ИФНС России № 10 по г.Москве )',
			kpp: '771001001',
			inn: '7710047253',
			okato: '45382000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Савеловский районный суд г. Москвы'
			},
			{id: 24,
			poluchatel: 'УФК по г. Москве (ИФНС России № 25 по г.Москве )',
			kpp: ' 772501001',
			inn: '7725068979',
			okato: '45914000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Симоновский районный суд г. Москвы'
			},
			{id: 25,
			poluchatel: 'УФК МФ РФ по г. Москве (ИФНС России № 29 по г.Москве)',
			kpp: '772901001',
			inn: '7729150007',
			okato: '45326000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Солнцевский районный суд г. Москвы'
			},
			{id: 26,
			poluchatel: 'УФК по г. Москве (ИФНС России № 9 по г.Москве )',
			kpp: '770901001',
			inn: '7709000010',
			okato: '45381000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Таганский районный суд г. Москвы'
			},
			{id: 27,
			poluchatel: 'УФК по г. Москве (ИФНС России № 7 по г.Москве )',
			kpp: '770701001',
			inn: '7707081688',
			okato: '45382000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Тверской районный суд г. Москвы'
			},
			{id: 28,
			poluchatel: 'УФК по г. Москве (ИФНС России № 13 по г.Москве )',
			kpp: '771301001',
			inn: '7713034630',
			okato: '45346000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Тимирязевский районный суд г. Москвы'
			},
			{id: 29,
			poluchatel: 'УФК по г. Москве (ИФНС России № 33 по г.Москве )',
			kpp: '773301001',
			inn: '7733053334',
			okato: '45368000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Тушинский районный суд г. Москвы'
			},
			{id: 31,
			poluchatel: 'УФК по г. Москве (ИФНС России № 4 по г.Москве )',
			kpp: '770401001',
			inn: '7704058987',
			okato: '45383000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Хамовнический районный суд г. Москвы'
			},
			{id: 32,
			poluchatel: 'УФК по г. Москве (ИФНС России № 34 по г.Москве )',
			kpp: '773401001',
			inn: '7734110842',
			okato: '45371000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Хорошевский районный суд г. Москвы'
			},
			{id: 30,
			poluchatel: 'УФК по г. Москве (ИФНС России № 27 по г.Москве )',
			kpp: '772701001',
			inn: '7727092173',
			okato: '45397000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Черемушкинский районный суд г. Москвы'
			},
			{id: 33,
			poluchatel: 'УФК по г. Москве (ИФНС России № 26 по г.Москве )',
			kpp: '772601001',
			inn: '7726062105',
			okato: '45920000',
			schet: '40101810800000010041',
			ucherejdenie: 'УФК МФ РФ по г. Москве',
			kbk: '18210803010011000110',
			adress: 'Чертановский районный суд г. Москвы'
			},
			{id: 34,
			poluchatel: 'УФК МФ по г. Москве (ИФНС России № 24 г. Москвы)',
			kpp: '772401001',
			inn: '7724111558',
			okato: '45918000',
			schet: '40101810800000010041',
			ucherejdenie: 'Отделение 1 Москва',
			kbk: '18210803010011000110',
			adress: 'Щербинский районный суд г. Москвы'
			}
	];
})();