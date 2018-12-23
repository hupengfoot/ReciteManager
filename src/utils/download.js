


export function download(content,filename) {console.log(1)
  const blob = new Blob([content])
  if (window.navigator.msSaveOrOpenBlob) {
    // 兼容IE10
    navigator.msSaveBlob(blob, filename)
  } else {
    //  chrome/firefox
    let aTag = document.createElement('a')
    aTag.download = filename
    aTag.href = URL.createObjectURL(blob)
    aTag.click()
    URL.revokeObjectURL(aTag.href)
  }
}


