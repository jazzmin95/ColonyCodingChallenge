export function weiToEth(wei: string | number): string {
    return (Number(wei) / Math.pow(10, 18)).toString();
}

export function ethToWei(eth: string | number): string {
    return (Number(eth) * Math.pow(10, 18)).toString();
}