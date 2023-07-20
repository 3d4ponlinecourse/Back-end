"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toICommentDtos = exports.toIComentDto = void 0;
function toIComentDto(data) {
    return {
        ...data,
        postedBy: data.user,
    };
}
exports.toIComentDto = toIComentDto;
// create function toICommentDtos that reciever array of ICommentWithUserDto and return arr of IContentDto
function toICommentDtos(data) {
    return data.map((data) => toIComentDto(data));
}
exports.toICommentDtos = toICommentDtos;
//# sourceMappingURL=comment.js.map