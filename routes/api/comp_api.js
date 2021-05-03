const express = require('express');
const router = express.Router();
const db_config = require('../../models/db');
const conn = db_config.init();
const pool = db_config.pool();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');
const moment = require("moment");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // module import
const dotev = require("dotenv");
dotev.config();




router.post('/compInfo', async (req, res, next) => {
    let result_status = false;

    console.log('req.headers[\'authorization\'] -> ', req.headers['authorization']);
    try {
        // if (!req.headers['authorization']) {
        //     console.log('req.headers[\'authorization\'] -> ', req.headers['authorization']);
        //     return res.json({"code": '000', "desc": "auth-token missing error", "info": null});
        // }
        // // verify auth credentials
        // const base64Credentials =  req.headers['authorization'].split(' ')[1];
        // let decodedValue = jwt.verify(base64Credentials, process.env.COMM_PASSWD,);
        // console.log('base64Credentials -> ',base64Credentials)
        // console.log('process.env.COMM_PASSWD -> ',process.env.COMM_PASSWD)
        // console.log('decodedValue.username -> ',decodedValue.username)
        // // decodedValue -  { username:  'kdh', iat:1616514554 }
        //
        // const sql0 = ` SELECT
        //                     count(*) cnt
        //                FROM user
        //                WHERE username = ? `;
        //
        // await new Promise(async (res, rej) => {
        //         await conn.query(sql0, [decodedValue.username], (err, rows) => {
        //             if (err) rej(err);
        //             else res(rows[0].cnt);
        //         });
        //     }
        // ).then( (val) => {
        //         val > 0 ?
        //             result_status = true
        //             :
        //             result_status = false
        //     }
        // ).catch(e => {
        //     throw new Error(e);
        // })
        //
        // console.log('result_status - ', result_status);
        // if (!result_status){
        //     return res.json({"code": '000', "desc": "auth failure", "info": null});
        // }

        let {
            compCd
        } = req.body;
        console.log('compCd ->>>>> ', compCd)

        const sql = ` SELECT
                          M.id,
                          M.comp_cd,
                          M.comp_nm,
                          M.comp_tel,
                          M.use as useGbn,
                          M.ceo_nm,
                          M.addr,
                          M.addr_desc,
                          M.fax,
                          M.img
                        FROM comp M
                       WHERE M.comp_cd = ? 
                      `;

        const result = await pool.query(sql,
            [compCd],
        );

        console.log('sql ->>>>>>> ', sql);
        console.log('compCd ->>>>>>> ', compCd);
        console.log('result ->>>>>>> ', result);

        res.json({info:result[0]});
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});


router.post('/compInfoByUserNm', async (req, res, next) => {
    let result_status = false;

    console.log('req.headers[\'authorization\'] -> ', req.headers['authorization']);
    try {
        if (!req.headers['authorization']) {
            console.log('req.headers[\'authorization\'] -> ', req.headers['authorization']);
            return res.json({"code": '000', "desc": "auth-token missing error", "info": null});
        }
        // verify auth credentials
        const base64Credentials =  req.headers['authorization'].split(' ')[1];
        let decodedValue = jwt.verify(base64Credentials, process.env.COMM_PASSWD,);
        console.log('base64Credentials -> ',base64Credentials)
        console.log('process.env.COMM_PASSWD -> ',process.env.COMM_PASSWD)
        console.log('decodedValue.username -> ',decodedValue.username)
        // decodedValue -  { username:  'kdh', iat:1616514554 }

        const sql0 = ` SELECT
                            count(*) cnt
                       FROM user
                       WHERE username = ? `;

        await new Promise(async (res, rej) => {
                await conn.query(sql0, [decodedValue.username], (err, rows) => {
                    if (err) rej(err);
                    else res(rows[0].cnt);
                });
            }
        ).then( (val) => {
                val > 0 ?
                    result_status = true
                    :
                    result_status = false
            }
        ).catch(e => {
            throw new Error(e);
        })

        console.log('result_status - ', result_status);
        if (!result_status){
            return res.json({"code": '000', "desc": "auth failure", "info": null});
        }

        let {
            userNm
        } = req.body;
        console.log('userNm ->>>>> ', userNm)

        const sql = ` 
                    SELECT c.id,c.comp_cd,c.comp_nm,c.comp_tel,c.use,c.ceo_nm,c.addr,c.addr_desc,c.fax,c.img
                    FROM user u
                     INNER JOIN comp c 
                       ON u.compCd = c.id
                    WHERE u.username = ?
                    `;

        const result = await pool.query(sql,
            [userNm],
        );

        console.log('sql ->>>>>>> ', sql);
        console.log('userNm ->>>>>>> ', userNm);
        console.log('result ->>>>>>> ', result);

        res.json({compInfo:result[0]});
    }
    catch (e) {
        console.error(e);
        next(e);
    }
});






module.exports = router;


// UPDATE support_table A
//   INNER JOIN member_table B
//     ON A.sp_uid=B.user_id
//   SET B.level=7
// WHERE B.level=9 AND A.support_money > 10000



// var express = require('express')
// var router = express.Router()
// const pool = require('../database/pool')
//
// router.post('/:boardId/comment', async (req, res, next) => {
//     const { boardId } = req.params
//     const { content } = req.body
//
//     const conn = await pool.getConnection()
//     try {
//         await conn.beginTransaction() // ?�랜??�� ?�용 ?�작
//
//         const ins = await conn.query('insert into board_comment set ?', { board_id: boardId, content: content })
//         const upd = await conn.query('update board set comment_cnt = comment_cnt + 1 where board_id = ?', [boardId])
//
//         await conn.commit() // 커밋
//         return res.json(ins)
//     } catch (err) {
//         console.log(err)
//         await conn.rollback() // 롤백
//         return res.status(500).json(err)
//     } finally {
//         conn.release() // conn ?�수
//     }
// )




