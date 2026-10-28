// Checks race completion when computing remaining race time.

const SESSION_FLAG_CHECKERED = 0x00000001;

export const isCheckeredFlag = (flags: number): boolean => (flags & SESSION_FLAG_CHECKERED) !== 0;
