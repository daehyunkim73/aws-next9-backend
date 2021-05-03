const winstonDaily = require('winston-daily-rotate-file');
//winstonDaily => 날짜별 파일을 생성을 위한, 로그 파일 관리 기본적으로 하루 단위로 새 로그 파일을 생성 및 크기와 최대 저장파일 개수등을 설정 가능
const { createLogger, format, transports } = require('winston');

//log level => error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6,

const logger = createLogger({ //3버전 이후에 createLogger로 해야함
    transports: [
        new (winstonDaily)({ //로그파일 생선에 관한 설정
            name: 'info-file',
            filename: `log/info/serverInfo-%DATE%.log`, //경로 지정 및 날짜 
            colorize: false,
            zippedArchive: true, //압축여부를 true
            maxFiles: '30',
            level: 'info',
            format: format.combine( //관련설정 포멧을 설정
                format.label({ //관련설정 포멧을 설정
                    label: 'server' //라벨을 정의 (서버호스트명으로 많이 사용)
                }),
                format.timestamp({ //시간의 형식을 정의
                    format: "YYYY-MM-DD HH:mm:ss"
                }),
                format.printf( //파일안에 로그 형식을 정의
                    info => `{"${info.timestamp}"} "[${info.label}]" "${info.level}" "${info.message}" `
                )
            ),
            showlevel: true,
            json: false,
        }),

        new (transports.Console)({ //콘솔 출력
            name: 'debug-console',
            colorize: true,
            level: 'Debug',
            format: format.combine(
                format.colorize(), //색깔 넣어서 출력
                format.timestamp({
                    format: "YYY-MM-DD HH:mm:ss"
                }),
                format.printf(
                    info => `{"${info.timestamp}"  "[${info.label}]"  "${info.level}"  "${info.message}"}`
                )
            ),
            showlevel: true,
            json: false,
        })
    ]
});

const error_logger = createLogger({ //error loger
    transports: [
        new (winstonDaily)({ //error 로그파일 생선에 관한 설정
            name: 'error-file',
            filename: `log/error/serverError-%DATE%.log`, //경로 지정 및 날짜 
            colorize: false,
            zippedArchive: true, //압축여부를 true
            maxFiles: '30', // 30일
            level: 'error',
            format: format.combine( //관련설정 포멧을 설정
                format.label({ //관련설정 포멧을 설정
                    label: 'error' //라벨을 정의 (서버호스트명으로 많이 사용)
                }),
                format.timestamp({ //시간의 형식을 정의
                    format: "YYYY-MM-DD HH:mm:ss"
                }),
                format.printf( //파일안에 로그 형식을 정의
                    error => `{"${error.timestamp}"} "[${error.label}]" "${error.level}" "${error.message}" `
                )
            ),
            showlevel: true,
            json: false,
        }),
    ]
})

logger.stream = {  // httpd log  출력하기
    write: (message, encoding) => {
        logger.info(message); // message를 default 포맷으로 출력
    },
};

error_logger.stream = {
    write: (message, encoding) => {
        logger.error(message); // message를 default 포맷으로 출력
    },
}

module.exports = { logger, error_logger };