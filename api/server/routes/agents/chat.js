const express = require('express');
const { generateCheckAccess, skipAgentCheck } = require('@librechat/api');
const { PermissionTypes, Permissions } = require('librechat-data-provider');
const {
  setHeaders,
  moderateText,
  // validateModel,
  validateConvoAccess,
  buildEndpointOption,
} = require('~/server/middleware');
const { initializeClient } = require('~/server/services/Endpoints/agents');
const AgentController = require('~/server/controllers/agents/request');
const addTitle = require('~/server/services/Endpoints/agents/title');
const { getRoleByName } = require('~/models/Role');

const router = express.Router();

router.use(moderateText);

const checkAgentAccess = generateCheckAccess({
  permissionType: PermissionTypes.AGENTS,
  permissions: [Permissions.USE],
  skipCheck: skipAgentCheck,
  getRoleByName,
});

router.use(checkAgentAccess);
router.use(validateConvoAccess);
router.use(buildEndpointOption);
router.use(setHeaders);

const controller = async (req, res, next) => {
  // 🔍 LOGS DE TRAÇAGE PERPLEXITY AGENTS
  console.log('[AGENTS-ENTRY] Route agents appelée');
  console.log('[AGENTS-ENTRY] endpoint:', req.params.endpoint);
  console.log('[AGENTS-ENTRY] body.endpoint:', req.body?.endpoint);
  console.log('[AGENTS-ENTRY] body.model:', req.body?.model);
  console.log('[AGENTS-ENTRY] isPerplexity:', req.body?.endpoint?.toLowerCase().includes('perplexity') || req.body?.model?.includes('sonar'));
  console.log('[AGENTS-ENTRY] req.body complet:');
  console.dir(req.body, { depth: null, colors: true });

  await AgentController(req, res, next, initializeClient, addTitle);
};

/**
 * @route POST / (regular endpoint)
 * @desc Chat with an assistant
 * @access Public
 * @param {express.Request} req - The request object, containing the request data.
 * @param {express.Response} res - The response object, used to send back a response.
 * @returns {void}
 */
router.post('/', controller);

/**
 * @route POST /:endpoint (ephemeral agents)
 * @desc Chat with an assistant
 * @access Public
 * @param {express.Request} req - The request object, containing the request data.
 * @param {express.Response} res - The response object, used to send back a response.
 * @returns {void}
 */
router.post('/:endpoint', controller);

module.exports = router;
