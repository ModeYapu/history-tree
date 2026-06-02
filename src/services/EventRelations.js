/**
 * 事件关联系统 - 管理历史事件间的关系
 * 支持因果关系、并行关系、影响关系，以及关联可视化数据生成
 */

class EventRelations {
    constructor() {
        this.relations = new Map(); // relationId → relation object
        this.eventRelationIndex = new Map(); // eventId → Set<relationId>
    }

    /**
     * 创建关系
     * @param {Object} params
     * @param {string} params.sourceId - 源事件ID
     * @param {string} params.targetId - 目标事件ID
     * @param {string} params.type - 关系类型: 'causal' | 'parallel' | 'influence'
     * @param {string} params.description - 关系描述
     * @param {number} params.strength - 关系强度 1-10
     * @returns {Object} 创建的关系
     */
    createRelation({ sourceId, targetId, type, description = '', strength = 5 }) {
        if (!sourceId || !targetId) {
            throw new Error('sourceId and targetId are required');
        }
        if (!['causal', 'parallel', 'influence'].includes(type)) {
            throw new Error('type must be one of: causal, parallel, influence');
        }

        const id = `rel_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        const relation = {
            id,
            sourceId,
            targetId,
            type,
            description,
            strength: Math.max(1, Math.min(10, strength)),
            createdAt: Date.now()
        };

        this.relations.set(id, relation);
        this._addToIndex(sourceId, id);
        this._addToIndex(targetId, id);

        return relation;
    }

    /**
     * 删除关系
     */
    deleteRelation(relationId) {
        const relation = this.relations.get(relationId);
        if (!relation) return false;

        this._removeFromIndex(relation.sourceId, relationId);
        this._removeFromIndex(relation.targetId, relationId);
        this.relations.delete(relationId);
        return true;
    }

    /**
     * 获取事件的所有关系
     */
    getRelationsForEvent(eventId) {
        const relationIds = this.eventRelationIndex.get(eventId);
        if (!relationIds) return [];
        return [...relationIds]
            .map(id => this.relations.get(id))
            .filter(Boolean);
    }

    /**
     * 获取特定类型的关系
     */
    getRelationsByType(type) {
        return [...this.relations.values()].filter(r => r.type === type);
    }

    /**
     * 获取两个事件之间的关系
     */
    getRelationsBetween(eventIdA, eventIdB) {
        return [...this.relations.values()].filter(r =>
            (r.sourceId === eventIdA && r.targetId === eventIdB) ||
            (r.sourceId === eventIdB && r.targetId === eventIdA)
        );
    }

    /**
     * 获取因果链 - 从指定事件出发，追溯所有因果路径
     */
    getCausalChain(eventId, direction = 'forward', maxDepth = 10) {
        const chain = [];
        const visited = new Set();
        const queue = [{ id: eventId, depth: 0 }];
        visited.add(eventId);

        while (queue.length > 0) {
            const { id, depth } = queue.shift();

            const relations = this.getRelationsForEvent(id);
            const causalRelations = relations.filter(r => r.type === 'causal');

            for (const rel of causalRelations) {
                const nextId = direction === 'forward'
                    ? (rel.sourceId === id ? rel.targetId : null)
                    : (rel.targetId === id ? rel.sourceId : null);

                if (nextId && !visited.has(nextId)) {
                    visited.add(nextId);
                    if (depth + 1 > maxDepth) continue;
                    chain.push({
                        from: rel.sourceId,
                        to: rel.targetId,
                        relation: rel,
                        depth: depth + 1
                    });
                    queue.push({ id: nextId, depth: depth + 1 });
                }
            }
        }

        return chain;
    }

    /**
     * 批量从 HistoryNode 节点导入关系
     * @param {HistoryNode[]} nodes
     */
    importFromNodes(nodes) {
        let count = 0;
        for (const node of nodes) {
            if (!node.relations) continue;

            // 导入因果关系
            for (const targetId of (node.relations.causes || [])) {
                this.createRelation({
                    sourceId: targetId,
                    targetId: node.id,
                    type: 'causal',
                    description: `${targetId} 导致 ${node.name || node.id}`
                });
                count++;
            }

            for (const targetId of (node.relations.effects || [])) {
                this.createRelation({
                    sourceId: node.id,
                    targetId,
                    type: 'causal',
                    description: `${node.name || node.id} 导致 ${targetId}`
                });
                count++;
            }

            // 导入相关关系 → 映射为 influence
            for (const targetId of (node.relations.related || [])) {
                // 避免重复
                const existing = this.getRelationsBetween(node.id, targetId);
                if (existing.length === 0) {
                    this.createRelation({
                        sourceId: node.id,
                        targetId,
                        type: 'influence',
                        description: `${node.name || node.id} 与 ${targetId} 相关`
                    });
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * 生成可视化数据（用于 D3/Canvas 绘制）
     */
    getVisualizationData(eventIds = null) {
        let relations = [...this.relations.values()];

        // 过滤到指定事件集合
        if (eventIds) {
            const idSet = new Set(eventIds);
            relations = relations.filter(
                r => idSet.has(r.sourceId) && idSet.has(r.targetId)
            );
        }

        const nodes = new Map();
        const links = [];

        for (const rel of relations) {
            if (!nodes.has(rel.sourceId)) {
                nodes.set(rel.sourceId, { id: rel.sourceId });
            }
            if (!nodes.has(rel.targetId)) {
                nodes.set(rel.targetId, { id: rel.targetId });
            }

            links.push({
                source: rel.sourceId,
                target: rel.targetId,
                type: rel.type,
                strength: rel.strength,
                description: rel.description,
                relationId: rel.id
            });
        }

        return {
            nodes: [...nodes.values()],
            links,
            stats: {
                totalRelations: relations.length,
                byType: {
                    causal: relations.filter(r => r.type === 'causal').length,
                    parallel: relations.filter(r => r.type === 'parallel').length,
                    influence: relations.filter(r => r.type === 'influence').length
                }
            }
        };
    }

    /**
     * 获取统计信息
     */
    getStats() {
        const allRelations = [...this.relations.values()];
        return {
            totalRelations: allRelations.length,
            totalEvents: this.eventRelationIndex.size,
            byType: {
                causal: allRelations.filter(r => r.type === 'causal').length,
                parallel: allRelations.filter(r => r.type === 'parallel').length,
                influence: allRelations.filter(r => r.type === 'influence').length
            },
            avgStrength: allRelations.length > 0
                ? allRelations.reduce((sum, r) => sum + r.strength, 0) / allRelations.length
                : 0
        };
    }

    // --- Private helpers ---

    _addToIndex(eventId, relationId) {
        if (!this.eventRelationIndex.has(eventId)) {
            this.eventRelationIndex.set(eventId, new Set());
        }
        this.eventRelationIndex.get(eventId).add(relationId);
    }

    _removeFromIndex(eventId, relationId) {
        const set = this.eventRelationIndex.get(eventId);
        if (set) {
            set.delete(relationId);
            if (set.size === 0) {
                this.eventRelationIndex.delete(eventId);
            }
        }
    }
}

window.EventRelations = EventRelations;
