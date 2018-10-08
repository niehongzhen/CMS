//配置文件
var config = {
    DBurl: 'mongodb://127.0.0.1:27017',//数据库的地址
    DbName: 'koa',//数据库的名字,
    alipayOption: {
        app_id: '2017122101048570',
        appPrivKeyFile: "MIIEowIBAAKCAQEA2YqSo7uX27Fdi32MEx2hAmfZUWl19KNovLLEm3P6mlQYkD7+ThVE8468n8meyTBl2QC8YXQVbGANbFdwdcxldDnOUKv7f9VFiaXn+jT0t9hJ00t5HLJ2yY85hMWFhuO+wxIjZdJ82u4dekY7F2T32wC7qIx4dsncPVfCvW4nB8Co6+eVi+PBEkp92HiBk/b4HbjhZxBCe9urbiN9syO5ZlVzAPUDcDvlRVSICv0S9BzWCQPjzxO8sd6jvJ/EFBmbz9VjvFbOkwSoibElY7kShDtAR2Ae/PTzEF2hvOUKVI/hW7T2p7VewgYF1kcPxlLoZJ8Zljxn7EYhMmsfukbPHQIDAQABAoIBAHPUS9XwWaA5ZTSTiZTYDtXoE5c8jvjOVUM78GFRNJsdseKEGAXdX1RLqPVvdiNrqJ8NvEArfgixcBRCznd6eH6VFNxxZj0fgqIS+1yG+9Iz0MM3iWoVQBh8MUUXosw60WSucLiThbVQWdO0N1xyf2JVlpXdDXs6ahEjfGY+k3uVR0No0qIBgwirM2Ofyk3orgBFxXgEbjpoAindpglrqhw2LlMMNb9wwNkjzB/guiYhRu3xOoodstPqcR/FXy0WLRc6W+pxF83E7lPJ22U3DLM2yIc4NQjGxa8Kfkhm0fQUQz5M1akRfk0nj6w8sIjd5XJKgw+Cjosh4EubHVptpyUCgYEA8DzEleQo01hdZqHLeYBghbuEuoFm+N80Xk/7i4Dxlny2R4ZO/sCH3ZURbwcI4kA2WvdScB2Lir9NI10HJNW3xJRjVpumPzfrNxLoYZb+2h0eSS6peIlMAidZyspwGEwLE+jelnMQu8IVbKQ0aTN8tjpKolbpII95Tlq58Ijf8ksCgYEA59CVDkNU+dCufVnLHkOASrd0AGmXMccKeBZfpNlZIdmH9/KBRbXiUec8TWgDwfZg8e//FMCA7r4Y4pj2XZhb+G0M3FfBf2hjKjkqVDEv9+3zYK4zI07ts2WRvkLgY+SvzFYwSEo/U72zka1ocWdDZtiNdXqqAC5DTTc6zIIsozcCgYBPDdAq+v+sPIHPyiIpA2O/3isZLIf0EY8sEenWyEG3oaZh9wJ7tmN/ORSZkpkLytGYMZbBKhfHOphpsK0vI9zrJWFjGKkmWIJghypNIuEOaVKUBnTiI1wNwWE86Ezm0e87SAAnRgoVnxJpw8czbyv0003ICg2BF3V1oUlaq8/17QKBgAD+cvUpsr6Td3wQG3/YuD8ZxESQL1bGTLQxHF3flLNBdITKpGVBH2RMgoSucn2tacL/zW8wWB0t8XtfPocuNQ6+oPR859Z9AxfWQOk1gMgmXAnJFW0MVJaVU+el78Jd46cTo4db0iOwx4lTXgRGdhKF0S10xi/UAvPczcK8uCZHAoGBAN+74UouDYmZaAfzj5O0857ZVHBiXtJ5AasYqbBALZ17EqTjscYcD3nlvWhoX7JtGAyU09fuH23NK6hpi3yk67KUBuJOab+wjjDUIIAveFqjmiaV+Ra727v39d2ide534ikOfz04RDiAUVA43V+a3kdaAXuvTfhF+mczjN3joFtm",
        alipayPubKeyFile: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhb/KlxYfhRE8KRp92MQM8ZB8NVjoM9LYFOnPIuNtcMZVA8ld7ybDP2FiA+QEE7wLGqMImwl1Y4xzkrTLCjHVC8fdR8ZvzZR2I3ZOrARerI9+RbkCfT+7YLv55+A+WTHEyiB+v7PfXVTT28s0CHNLPXMyQD1u8UVEQEpbMSs8hH3pJF55Li7kc5VvJpV3RVO9TXZTVAA5mSp9FvO3u+47IJDgFVLnqqHh6ETL1nHVpxiAY2LGer+RWpVYD8v+We+VWsrfJP7bO0xr2pwizldepo8YNYPgcIAIwd7KiveypL1pA0xWgSjUHzrkVh1j/nSnvJgKSdydU/VRcaVt/Mt8wwIDAQAB"
    }

}

module.exports = config;